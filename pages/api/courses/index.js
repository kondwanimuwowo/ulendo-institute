import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { category, instructorId, published } = req.query;

        const where = {};
        if (category) where.category = { slug: category };
        if (instructorId) where.instructorId = instructorId;
        if (published !== undefined) where.published = published === 'true';
        else where.published = true; // Default to only published

        const courses = await prisma.course.findMany({
            where,
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        instructorPhoto: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: { lessons: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return res.status(200).json({
            success: true,
            courses,
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
