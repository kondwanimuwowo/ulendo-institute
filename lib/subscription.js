import prisma from './prisma.js';

/**
 * Check if a user has an active subscription
 * @param {string} userId - User ID to check
 * @returns {Promise<Object|null>} Active subscription or null
 */
export async function getActiveSubscription(userId) {
    if (!userId) return null;

    const now = new Date();

    const subscription = await prisma.subscription.findFirst({
        where: {
            userId,
            status: 'ACTIVE',
            currentPeriodEnd: {
                gte: now, // Subscription hasn't expired
            },
        },
        include: {
            plan: true,
        },
        orderBy: {
            currentPeriodEnd: 'desc',
        },
    });

    return subscription;
}

/**
 * Check if a user has any active subscription
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} True if user has active subscription
 */
export async function hasActiveSubscription(userId) {
    const subscription = await getActiveSubscription(userId);
    return !!subscription;
}

/**
 * Check if a user can access a specific lesson
 * @param {string} userId - User ID
 * @param {Object} lesson - Lesson object with isFree property
 * @returns {Promise<boolean>} True if user can access the lesson
 */
export async function canAccessLesson(userId, lesson) {
    // Free lessons are always accessible
    if (lesson.isFree) return true;

    // Check for active subscription
    return hasActiveSubscription(userId);
}

/**
 * Get all subscriptions for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} List of subscriptions
 */
export async function getUserSubscriptions(userId) {
    return prisma.subscription.findMany({
        where: { userId },
        include: { plan: true },
        orderBy: { createdAt: 'desc' },
    });
}

/**
 * Create a pending subscription
 * @param {Object} params - Subscription parameters
 * @returns {Promise<Object>} Created subscription
 */
export async function createPendingSubscription({ userId, planId, externalReference }) {
    return prisma.subscription.create({
        data: {
            userId,
            planId,
            status: 'PENDING',
            externalSubscriptionId: externalReference,
        },
        include: { plan: true },
    });
}

/**
 * Activate a subscription after successful payment
 * @param {string} subscriptionId - Subscription ID to activate
 * @param {Object} params - Activation parameters
 * @returns {Promise<Object>} Updated subscription
 */
export async function activateSubscription(subscriptionId, { externalCustomerId } = {}) {
    const subscription = await prisma.subscription.findUnique({
        where: { id: subscriptionId },
        include: { plan: true },
    });

    if (!subscription) {
        throw new Error('Subscription not found');
    }

    const now = new Date();
    const periodEnd = new Date(now);

    // Calculate period end based on plan interval
    if (subscription.plan.interval === 'YEAR') {
        periodEnd.setFullYear(periodEnd.getFullYear() + 1);
    } else {
        periodEnd.setMonth(periodEnd.getMonth() + 1);
    }

    return prisma.subscription.update({
        where: { id: subscriptionId },
        data: {
            status: 'ACTIVE',
            currentPeriodStart: now,
            currentPeriodEnd: periodEnd,
            externalCustomerId: externalCustomerId || undefined,
        },
        include: { plan: true },
    });
}

/**
 * Find subscription by external reference
 * @param {string} reference - External subscription/reference ID
 * @returns {Promise<Object|null>} Subscription or null
 */
export async function findSubscriptionByReference(reference) {
    return prisma.subscription.findFirst({
        where: { externalSubscriptionId: reference },
        include: { plan: true, user: true },
    });
}
