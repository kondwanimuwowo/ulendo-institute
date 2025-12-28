import prisma from '../../../../lib/prisma.js';
import { getAuthUser } from '../../../../lib/auth.js';

// Helper to generate slug from title
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const user = getAuthUser(req);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify instructor status
        const fullUser = await prisma.user.findUnique({
            where: { id: user.userId },
            select: { role: true, instructorApproved: true }
        });

        if (fullUser?.role !== 'INSTRUCTOR' || !fullUser?.instructorApproved) {
            return res.status(403).json({ message: 'Not an approved instructor' });
        }

        const { title, description, thumbnail, categoryId, isFree } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }

        // Get or create category
        let category;
        if (categoryId) {
            category = await prisma.category.findFirst({
                where: { slug: categoryId }
            });
        }

        if (!category) {
            // Default to web-development category
            category = await prisma.category.upsert({
                where: { slug: 'web-development' },
                update: {},
                create: {
                    name: 'Web Development',
                    slug: 'web-development'
                }
            });
        }

        // Generate unique slug
        let slug = generateSlug(title);
        let slugExists = await prisma.course.findUnique({ where: { slug } });
        let counter = 1;

        while (slugExists) {
            slug = `${generateSlug(title)}-${counter}`;
            slugExists = await prisma.course.findUnique({ where: { slug } });
            counter++;
        }

        // Create course
        const course = await prisma.course.create({
            data: {
                title,
                slug,
                description,
                thumbnail: thumbnail || null,
                categoryId: category.id,
                instructorId: user.userId,
                isFree: isFree || false,
                published: false
            },
            include: {
                category: true
            }
        });

        return res.status(201).json({
            success: true,
            course
        });

    } catch (error) {
        console.error('Create course error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}
