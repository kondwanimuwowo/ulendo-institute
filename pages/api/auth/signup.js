import prisma from '../../../lib/prisma';
import { hashPassword, signToken, setAuthCookie } from '../../../lib/auth';
import { validateEmail, validateRequired, sanitizeString } from '../../../lib/validators';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { name, email, password } = req.body;

        // Validate required fields
        const validation = validateRequired({ name, email, password }, ['name', 'email', 'password']);
        if (!validation.valid) {
            return res.status(400).json({ error: `Missing required fields: ${validation.missing.join(', ')}` });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters long' });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        // Hash password
        const passwordHash = await hashPassword(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                name: sanitizeString(name),
                email: email.toLowerCase(),
                passwordHash,
                role: 'STUDENT', // Default role
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                instructorApproved: true,
                createdAt: true,
            },
        });

        // Sign JWT token
        const token = signToken(user);

        // Set auth cookie
        setAuthCookie(res, token);

        return res.status(201).json({
            success: true,
            user,
            token, // Also return token for debugging/testing
        });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
