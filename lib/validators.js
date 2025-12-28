/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate slug format (alphanumeric and hyphens only)
 * @param {string} slug - Slug to validate
 * @returns {boolean} True if valid slug
 */
export function validateSlug(slug) {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
}

/**
 * Basic HTML sanitization (strip script tags)
 * WARNING: This is a basic implementation. For production,
 * consider using a library like DOMPurify or sanitize-html
 * @param {string} html - HTML content to sanitize
 * @returns {string} Sanitized HTML
 */
export function sanitizeHtml(html) {
    if (!html) return '';

    // Remove script tags and their content
    let sanitized = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove on* event handlers
    sanitized = sanitized.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '');

    return sanitized;
}

/**
 * Validate required fields in an object
 * @param {Object} data - Data object to validate
 * @param {Array<string>} requiredFields - Array of required field names
 * @returns {Object} { valid: boolean, missing: Array<string> }
 */
export function validateRequired(data, requiredFields) {
    const missing = [];

    for (const field of requiredFields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            missing.push(field);
        }
    }

    return {
        valid: missing.length === 0,
        missing,
    };
}

/**
 * Sanitize string input (trim and basic XSS prevention)
 * @param {string} input - Input string
 * @returns {string} Sanitized string
 */
export function sanitizeString(input) {
    if (typeof input !== 'string') return '';

    return input
        .trim()
        .replace(/[<>]/g, '') // Remove angle brackets
        .substring(0, 1000); // Limit length
}
