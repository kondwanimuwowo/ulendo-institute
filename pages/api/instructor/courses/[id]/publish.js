import prisma from '../../../../../lib/prisma.js';
import { getAuthUser } from '../../../../../lib/auth.js';

export default async function handler(req, res) {
    const { id } = req.query;

    if (req.method !== 'PATCH') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = getAuthUser(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { published } = req.body;

        // Verify ownership
        const course = await prisma.course.findFirst({
            where: {
                id,
                instructorId: user.userId
            }
        });

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        // Update publish status
        const updated = await prisma.course.update({
            where: { id },
            data: { published }
        });

        return res.status(200).json({ success: true, course: updated });

    } catch (error) {
        console.error('Toggle publish error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
