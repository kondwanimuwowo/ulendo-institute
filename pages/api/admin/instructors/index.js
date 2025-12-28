import prisma from '../../../../lib/prisma';
import { getAuthUser } from '../../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const user = getAuthUser(req);
    if (!user || user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    try {
        const instructors = await prisma.user.findMany({
            where: {
                OR: [
                    { role: 'INSTRUCTOR' },
                    { instructorBio: { not: null } }
                ]
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                instructorApproved: true,
                instructorBio: true,
                instructorPhoto: true,
                instructorLinks: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return res.status(200).json(instructors);
    } catch (error) {
        console.error('Error fetching instructors:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
