import prisma from '../../../../lib/prisma.js';
import { getAuthUser } from '../../../../lib/auth.js';

export default async function handler(req, res) {
    const { lessonId } = req.query;

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = getAuthUser(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Mark lesson as complete
        await prisma.lessonProgress.upsert({
            where: {
                userId_lessonId: {
                    userId: user.userId,
                    lessonId
                }
            },
            update: {
                completed: true,
                completedAt: new Date()
            },
            create: {
                userId: user.userId,
                lessonId,
                completed: true,
                completedAt: new Date()
            }
        });

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Mark complete error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
