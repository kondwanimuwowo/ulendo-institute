import prisma from '../../../lib/prisma.js';
import { getAuthUser } from '../../../lib/auth.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = getAuthUser(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify admin role
        const fullUser = await prisma.user.findUnique({
            where: { id: user.userId },
            select: { role: true }
        });

        if (fullUser?.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        // Fetch all users
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                instructorApproved: true,
                createdAt: true
            },
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json({ success: true, users });

    } catch (error) {
        console.error('Admin users error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
