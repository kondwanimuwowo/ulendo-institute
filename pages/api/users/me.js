import prisma from '../../../lib/prisma';
import { getAuthUser } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Get authenticated user from request
        const authUser = getAuthUser(req);

        if (!authUser) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Fetch full user data from database
        const user = await prisma.user.findUnique({
            where: { id: authUser.userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                instructorApproved: true,
                instructorBio: true,
                instructorPhoto: true,
                instructorLinks: true,
                createdAt: true,
            },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get active subscription
        const subscription = await prisma.subscription.findFirst({
            where: {
                userId: user.id,
                status: { in: ['ACTIVE', 'PENDING'] }
            },
            include: { plan: true },
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json({
            success: true,
            user: {
                ...user,
                subscription
            },
        });

    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
