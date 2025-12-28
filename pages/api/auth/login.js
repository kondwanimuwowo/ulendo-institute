import prisma from '../../../lib/prisma';
import { comparePassword, signToken, setAuthCookie } from '../../../lib/auth';
import { validateEmail, validateRequired } from '../../../lib/validators';

export default async function handler(req, res) {
    console.log('Login request received:', req.method, req.body?.email);

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;

        // Validate required fields
        const validation = validateRequired({ email, password }, ['email', 'password']);
        if (!validation.valid) {
            return res.status(400).json({ error: `Missing required fields: ${validation.missing.join(', ')}` });
        }

        // Validate email format
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Verify password
        const isPasswordValid = await comparePassword(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Sign JWT token
        const token = signToken(user);

        // Set auth cookie
        setAuthCookie(res, token);

        // Return user data (exclude password hash)
        const { passwordHash, ...userData } = user;

        return res.status(200).json({
            success: true,
            user: userData,
            token, // Also return token for debugging/testing
        });

    } catch (error) {
        console.error('Login error details:', error);
        return res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}
