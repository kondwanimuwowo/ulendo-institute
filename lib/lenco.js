import crypto from 'crypto';

const LENCO_SECRET_KEY = process.env.LENCO_SECRET_KEY;
const LENCO_WEBHOOK_SECRET = process.env.LENCO_WEBHOOK_SECRET;
const LENCO_API_BASE = 'https://api.lenco.co/access/v1';

/**
 * Make an authenticated request to Lenco API
 * @param {string} endpoint - API endpoint (e.g., '/virtual-accounts')
 * @param {string} method - HTTP method
 * @param {Object} body - Request body
 * @returns {Promise<Object>} API response
 */
async function lencoRequest(endpoint, method = 'GET', body = null) {
    if (!LENCO_SECRET_KEY) {
        console.log('--- LENCO API LOG (No API Key) ---');
        console.log('Endpoint:', endpoint);
        console.log('Method:', method);
        console.log('Body:', JSON.stringify(body, null, 2));
        console.log('--- END LENCO LOG ---');
        return { success: true, mock: true, message: 'API key not configured, request logged' };
    }

    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${LENCO_SECRET_KEY}`,
            'Content-Type': 'application/json',
        },
    };

    if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(`${LENCO_API_BASE}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
        console.error('Lenco API error:', data);
        throw new Error(data.message || 'Lenco API request failed');
    }

    return data;
}

/**
 * Create a virtual account for payment collection
 * @param {Object} params - Account parameters
 * @param {string} params.accountName - Name for the virtual account
 * @param {string} params.reference - Unique reference (e.g., subscription ID)
 * @returns {Promise<Object>} Virtual account details
 */
export async function createVirtualAccount({ accountName, reference }) {
    return lencoRequest('/virtual-accounts', 'POST', {
        account_name: accountName,
        reference: reference,
        is_permanent: false, // Temporary account for this transaction
    });
}

/**
 * Get transactions for a virtual account
 * @param {string} accountId - Virtual account ID
 * @returns {Promise<Object>} Transaction list
 */
export async function getTransactions(accountId) {
    return lencoRequest(`/virtual-accounts/${accountId}/transactions`);
}

/**
 * Verify webhook signature from Lenco
 * @param {string} payload - Raw request body as string
 * @param {string} signature - X-Lenco-Signature header value
 * @returns {boolean} True if signature is valid
 */
export function verifyWebhookSignature(payload, signature) {
    if (!LENCO_WEBHOOK_SECRET) {
        console.warn('LENCO_WEBHOOK_SECRET not set, skipping signature verification');
        return true; // Allow in development
    }

    const expectedSignature = crypto
        .createHmac('sha512', LENCO_WEBHOOK_SECRET)
        .update(payload)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

/**
 * Parse and validate Lenco webhook event
 * @param {Object} body - Parsed webhook body
 * @returns {Object} Normalized event data
 */
export function parseWebhookEvent(body) {
    return {
        type: body.event || body.type,
        data: body.data || body,
        reference: body.data?.reference || body.reference,
        amount: body.data?.amount || body.amount,
        status: body.data?.status || body.status,
    };
}
