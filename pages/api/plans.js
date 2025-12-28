import prisma from '../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const plans = await prisma.plan.findMany({
            where: { isActive: true },
            orderBy: { priceCents: 'asc' },
        });

        return res.status(200).json({
            success: true,
            plans,
        });

    } catch (error) {
        console.error('Get plans error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
