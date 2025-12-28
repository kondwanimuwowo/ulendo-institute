import prisma from '../../../lib/prisma.js';
import { getAuthUser } from '../../../lib/auth.js';
import { createPendingSubscription, getActiveSubscription } from '../../../lib/subscription.js';

// Simple Lenco API call
async function initiateLencoPayment({ amount, email, phone, reference }) {
    const LENCO_SECRET_KEY = process.env.LENCO_SECRET_KEY;

    const payload = {
        amount: parseFloat(amount), // Ensure it's a number
        currency: 'ZMW',
        email,
        phone,
        reference,
        operator: 'airtel'
    };

    console.log('Lenco API Request:', JSON.stringify(payload, null, 2));

    const response = await fetch('https://api.lenco.co/access/v2/collections/mobile-money', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${LENCO_SECRET_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Lenco API Response:', JSON.stringify(data, null, 2));

    if (!response.ok) {
        console.error('Lenco API error:', data);
        throw new Error(data.message || 'Payment initiation failed');
    }

    return data;
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

        const { planId, phone } = req.body;

        if (!planId) {
            return res.status(400).json({ message: 'Plan ID is required' });
        }

        if (!phone) {
            return res.status(400).json({ message: 'Phone number is required for mobile money payment' });
        }

        // Get the plan
        const plan = await prisma.plan.findUnique({
            where: { id: planId },
        });

        if (!plan || !plan.isActive) {
            return res.status(404).json({ message: 'Plan not found or inactive' });
        }

        // Get user details
        const fullUser = await prisma.user.findUnique({
            where: { id: user.userId },
        });

        if (!fullUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check for existing active subscription
        const existingSub = await getActiveSubscription(user.userId);
        if (existingSub) {
            return res.status(400).json({ message: 'You already have an active subscription.' });
        }

        // Generate reference
        const reference = `sub_${user.userId}_${Date.now()}`;

        // Create pending subscription
        await createPendingSubscription({
            userId: user.userId,
            planId: plan.id,
            externalReference: reference
        });

        // Convert priceCents to standard amount (e.g., 2999 cents -> 29.99)
        const amount = plan.priceCents / 100;

        // Initiate payment with Lenco
        const paymentResult = await initiateLencoPayment({
            amount: amount,
            email: fullUser.email,
            phone: phone,
            reference
        });

        return res.status(200).json({
            success: true,
            reference,
            message: 'Payment initiated. Check your phone to approve.',
            paymentData: paymentResult
        });

    } catch (error) {
        console.error('Checkout error:', error);
        return res.status(500).json({
            message: `Failed to create checkout session: ${error.message}`
        });
    }
}
