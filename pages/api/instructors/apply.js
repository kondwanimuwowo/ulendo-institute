import prisma from '../../../lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    // Auth check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // Option 2: Check cookies if using cookies for JWT
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    }

    const token = authHeader ? authHeader.split(' ')[1] : req.cookies.token;

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        const { bio, photoUrl, website, linkedin } = req.body;

        if (!bio || bio.length < 20) {
            return res.status(400).json({ message: 'Bio is too short' });
        }

        const user = await prisma.user.update({
            where: { id: userId },
            data: {
                instructorBio: bio,
                instructorPhoto: photoUrl,
                instructorLinks: {
                    website,
                    linkedin
                },
                // Specifically NOT updating the role or instructorApproved here
            }
        });

        // Notify Admin
        const { sendEmail } = await import('../../../lib/sendgrid.js');
        await sendEmail({
            to: 'admin@example.com', // In production, this should be configurable
            subject: 'New Instructor Application',
            text: `A new instructor application has been submitted by ${user.name} (${user.email}).`,
            html: `
                <h1>New Instructor Application</h1>
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Bio:</strong> ${bio}</p>
                <p><a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/instructors">Review Application</a></p>
            `
        });

        return res.status(200).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Instructor application error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
