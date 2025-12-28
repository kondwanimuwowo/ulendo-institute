import prisma from '../../../../lib/prisma';
import { getAuthUser } from '../../../../lib/auth';
import { sendEmail } from '../../../../lib/sendgrid';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const admin = getAuthUser(req);
    if (!admin || admin.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const { userId, approve } = req.body;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                role: approve ? 'INSTRUCTOR' : user.role, // Only upgrade to INSTRUCTOR if approved
                instructorApproved: !!approve
            }
        });

        // Notify Instructor
        await sendEmail({
            to: user.email,
            subject: approve ? 'Your Instructor Application was Approved!' : 'Instructor Application Status',
            text: approve
                ? `Congratulations ${user.name}! Your application to become an instructor at Ulendo Institute has been approved.`
                : `Hello ${user.name}, we have reviewed your application and unfortunately we cannot approve it at this time.`,
            html: approve
                ? `<h1>Application Approved!</h1><p>Congratulations ${user.name}! Your application to become an instructor at Ulendo Institute has been approved. You can now start creating courses.</p>`
                : `<h1>Application Status</h1><p>Hello ${user.name}, we have reviewed your application and unfortunately we cannot approve it at this time.</p>`
        });

        return res.status(200).json({
            message: approve ? 'Instructor approved' : 'Instructor application rejected',
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating instructor status:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
