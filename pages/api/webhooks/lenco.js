import { verifyWebhookSignature, parseWebhookEvent } from '../../../lib/lenco';
import { findSubscriptionByReference, activateSubscription } from '../../../lib/subscription';
import prisma from '../../../lib/prisma';

// Disable body parsing to get raw body for signature verification
export const config = {
    api: {
        bodyParser: false,
    },
};

async function getRawBody(req) {
    const chunks = [];
    for await (const chunk of req) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks).toString('utf8');
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        // Get raw body for signature verification
        const rawBody = await getRawBody(req);
        const signature = req.headers['x-lenco-signature'];

        // Verify webhook signature
        if (signature && !verifyWebhookSignature(rawBody, signature)) {
            console.error('Invalid webhook signature');
            return res.status(401).json({ message: 'Invalid signature' });
        }

        // Parse the webhook payload
        const body = JSON.parse(rawBody);
        const event = parseWebhookEvent(body);

        console.log('Lenco webhook received:', event.type, event.reference);

        // Handle different event types
        switch (event.type) {
            case 'transaction.successful':
            case 'transaction_successful': {
                // Find subscription by reference
                const subscription = await findSubscriptionByReference(event.reference);

                if (!subscription) {
                    console.warn('Subscription not found for reference:', event.reference);
                    // Still return 200 to acknowledge receipt
                    return res.status(200).json({ received: true, processed: false });
                }

                if (subscription.status === 'ACTIVE') {
                    console.log('Subscription already active:', subscription.id);
                    return res.status(200).json({ received: true, processed: true });
                }

                // Activate the subscription
                await activateSubscription(subscription.id, {
                    externalCustomerId: event.data?.customer_id,
                });

                console.log('Subscription activated:', subscription.id);

                // TODO: Send confirmation email to user
                // await sendEmail({ to: subscription.user.email, ... });

                return res.status(200).json({ received: true, processed: true });
            }

            case 'transaction.failed':
            case 'transaction_failed': {
                const subscription = await findSubscriptionByReference(event.reference);

                if (subscription) {
                    await prisma.subscription.update({
                        where: { id: subscription.id },
                        data: { status: 'INCOMPLETE' },
                    });
                    console.log('Subscription marked as incomplete:', subscription.id);
                }

                return res.status(200).json({ received: true, processed: true });
            }

            default:
                console.log('Unhandled webhook event type:', event.type);
                return res.status(200).json({ received: true, processed: false });
        }
    } catch (error) {
        console.error('Webhook processing error:', error);
        // Still return 200 to prevent Lenco from retrying
        return res.status(200).json({ received: true, error: error.message });
    }
}
