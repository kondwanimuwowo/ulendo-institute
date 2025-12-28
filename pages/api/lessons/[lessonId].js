import prisma from '../../../lib/prisma.js';
import { getAuthUser } from '../../../lib/auth.js';
import { canAccessLesson } from '../../../lib/subscription.js';

export default async function handler(req, res) {
    const { lessonId } = req.query;
    const { courseSlug } = req.query;

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Fetch lesson with course
        const lesson = await prisma.lesson.findUnique({
            where: { id: lessonId },
            include: {
                course: {
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' }
                        },
                        instructor: {
                            select: { name: true }
                        }
                    }
                }
            }
        });

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson not found' });
        }

        // Check if user has access
        const user = getAuthUser(req);
        let hasAccess = lesson.isFree || lesson.course.isFree;
        let isCompleted = false;

        if (user && !hasAccess) {
            hasAccess = await canAccessLesson(user.userId, lesson);

            // Check if completed
            const progress = await prisma.lessonProgress.findUnique({
                where: {
                    userId_lessonId: {
                        userId: user.userId,
                        lessonId: lesson.id
                    }
                }
            });
            isCompleted = progress?.completed || false;
        }

        // Add completion status to lessons in course
        if (user) {
            const progressRecords = await prisma.lessonProgress.findMany({
                where: {
                    userId: user.userId,
                    lessonId: { in: lesson.course.lessons.map(l => l.id) }
                }
            });

            const progressMap = new Map(progressRecords.map(p => [p.lessonId, p.completed]));
            lesson.course.lessons = lesson.course.lessons.map(l => ({
                ...l,
                isCompleted: progressMap.get(l.id) || false
            }));
        }

        return res.status(200).json({
            success: true,
            lesson: {
                ...lesson,
                isCompleted
            },
            course: lesson.course,
            hasAccess
        });

    } catch (error) {
        console.error('Fetch lesson error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
