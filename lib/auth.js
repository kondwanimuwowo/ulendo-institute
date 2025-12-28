import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-jwt-secret-min-32-characters-long';

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} Hashed password
 */
export async function hashPassword(password) {
    return bcrypt.hash(password, 10);
}

/**
 * Compare a password with a hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} True if password matches
 */
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}

/**
 * Sign a JWT token for a user
 * @param {Object} user - User object with id, email, role
 * @returns {string} JWT token
 */
export function signToken(user) {
    const payload = {
        userId: user.id,
        email: user.email,
        role: user.role,
    };

    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: '7d', // Token expires in 7 days
    });
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} Decoded payload or null if invalid
 */
export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}

/**
 * Set authentication cookie in HTTP response
 * @param {Object} res - Next.js response object
 * @param {string} token - JWT token
 */
export function setAuthCookie(res, token) {
    const isProduction = process.env.NODE_ENV === 'production';

    res.setHeader('Set-Cookie', `auth-token=${token}; HttpOnly; Path=/; Max-Age=604800; SameSite=Strict${isProduction ? '; Secure' : ''}`);
}

/**
 * Clear authentication cookie
 * @param {Object} res - Next.js response object
 */
export function clearAuthCookie(res) {
    res.setHeader('Set-Cookie', 'auth-token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
}

/**
 * Get JWT token from request cookies
 * @param {Object} req - Next.js request object
 * @returns {string|null} JWT token or null
 */
export function getAuthToken(req) {
    const cookies = req.headers.cookie;
    if (!cookies) return null;

    const authCookie = cookies.split(';').find(c => c.trim().startsWith('auth-token='));
    if (!authCookie) return null;

    return authCookie.split('=')[1];
}

/**
 * Get authenticated user from request
 * @param {Object} req - Next.js request object
 * @returns {Object|null} Decoded user payload or null
 */
export function getAuthUser(req) {
    const token = getAuthToken(req);
    if (!token) return null;

    return verifyToken(token);
}

/**
 * Check if the user is an approved instructor
 * @param {Object} user - User object with instructorApproved and role
 * @returns {boolean} True if approved instructor
 */
export function isApprovedInstructor(user) {
    return user && user.role === 'INSTRUCTOR' && user.instructorApproved === true;
}
