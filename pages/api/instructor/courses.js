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

        // Check if user is an approved instructor
        const fullUser = await prisma.user.findUnique({
            where: { id: user.userId },
            select: { role: true, instructorApproved: true }
        });

        if (fullUser?.role !== 'INSTRUCTOR' || !fullUser?.instructorApproved) {
            return res.status(403).json({ message: 'Not an approved instructor' });
        }

        // Fetch instructor's courses
        const courses = await prisma.course.findMany({
            where: { instructorId: user.userId },
            include: {
                category: true,
                _count: {
                    select: {
                        lessons: true,
                        enrollments: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        return res.status(200).json({ success: true, courses });

    } catch (error) {
        console.error('Fetch instructor courses error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
