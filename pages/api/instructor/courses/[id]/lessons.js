import prisma from '../../../../../lib/prisma.js';
import { getAuthUser } from '../../../../../lib/auth.js';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = getAuthUser(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify course ownership
        const course = await prisma.course.findFirst({
            where: {
                id,
                instructorId: user.userId
            },
            include: {
                lessons: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const { title, content, videoUrl, isFree } = req.body;

        if (!title || !content) {
            return res.status(400).json({ message: 'Title and content are required' });
        }

        // Calculate next order number
        const maxOrder = course.lessons.length > 0
            ? Math.max(...course.lessons.map(l => l.order))
            : 0;

        // Create lesson
        const lesson = await prisma.lesson.create({
            data: {
                title,
                content,
                videoUrl: videoUrl || null,
                isFree: isFree || false,
                order: maxOrder + 1,
                courseId: id
            }
        });

        return res.status(201).json({ success: true, lesson });

    } catch (error) {
        console.error('Create lesson error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
