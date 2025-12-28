import prisma from '../../../../lib/prisma.js';
import { getAuthUser } from '../../../../lib/auth.js';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = getAuthUser(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Fetch course with lessons
        const course = await prisma.course.findFirst({
            where: {
                id,
                instructorId: user.userId
            },
            include: {
                category: true,
                lessons: {
                    orderBy: { order: 'asc' }
                },
                _count: {
                    select: {
                        enrollments: true
                    }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        return res.status(200).json({ success: true, course });

    } catch (error) {
        console.error('Fetch course error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
