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

        // Fetch platform stats
        const [
            totalUsers,
            totalCourses,
            activeSubscriptions,
            pendingInstructors,
            allSubscriptions
        ] = await Promise.all([
            prisma.user.count(),
            prisma.course.count({ where: { published: true } }),
            prisma.subscription.count({ where: { status: 'ACTIVE' } }),
            prisma.user.count({
                where: {
                    role: 'INSTRUCTOR',
                    instructorApproved: false
                }
            }),
            prisma.subscription.findMany({
                where: { status: 'ACTIVE' },
                include: { plan: true }
            })
        ]);

        // Calculate total revenue
        const revenue = allSubscriptions.reduce((sum, sub) => {
            return sum + (sub.plan?.priceCents || 0);
        }, 0);

        return res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalCourses,
                activeSubscriptions,
                pendingInstructors,
                revenue
            }
        });

    } catch (error) {
        console.error('Admin stats error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
