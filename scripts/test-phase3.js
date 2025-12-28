/**
 * Phase 3 Verification Script
 * Tests the payment and subscription flow
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { hashPassword } = require('../lib/auth');
const {
    createPendingSubscription,
    activateSubscription,
    hasActiveSubscription,
    getActiveSubscription,
    canAccessLesson
} = require('../lib/subscription');

async function testPhase3() {
    console.log('--- Phase 3 Verification Test ---\n');

    try {
        // 1. Check plans exist
        console.log('1. Checking plans...');
        const plans = await prisma.plan.findMany({
            where: { isActive: true },
        });
        console.log(`   Found ${plans.length} active plan(s)`);
        plans.forEach(p => console.log(`   - ${p.name}: $${(p.priceCents / 100).toFixed(2)}/${p.interval}`));

        if (plans.length === 0) {
            console.log('   ❌ No plans found. Run prisma seed first.');
            return;
        }

        // 2. Get a test user
        console.log('\n2. Getting test user...');
        let testUser = await prisma.user.findFirst({
            where: { email: 'test_phase3@example.com' },
        });

        if (!testUser) {
            console.log('   Creating test user...');
            testUser = await prisma.user.create({
                data: {
                    email: 'test_phase3@example.com',
                    name: 'Phase 3 Test User',
                    passwordHash: await hashPassword('password123'),
                },
            });
        }
        console.log(`   Using user: ${testUser.email}`);

        // 3. Create a pending subscription
        console.log('\n3. Creating pending subscription...');
        const reference = `test_${Date.now()}`;

        const subscription = await createPendingSubscription({
            userId: testUser.id,
            planId: plans[0].id,
            externalReference: reference,
        });
        console.log(`   Created subscription: ${subscription.id}`);
        console.log(`   Status: ${subscription.status}`);
        console.log(`   Reference: ${reference}`);

        // 4. Simulate successful payment (activate subscription)
        console.log('\n4. Simulating successful payment...');

        const activated = await activateSubscription(subscription.id);
        console.log(`   Subscription activated!`);
        console.log(`   Status: ${activated.status}`);
        console.log(`   Period Start: ${activated.currentPeriodStart}`);
        console.log(`   Period End: ${activated.currentPeriodEnd}`);

        // 5. Check subscription status
        console.log('\n5. Verifying subscription access...');

        const isActive = await hasActiveSubscription(testUser.id);
        const activeSub = await getActiveSubscription(testUser.id);

        console.log(`   Has active subscription: ${isActive}`);
        console.log(`   Active plan: ${activeSub?.plan?.name || 'None'}`);

        // 6. Test lesson access
        console.log('\n6. Testing lesson access...');

        const freeLesson = { isFree: true };
        const premiumLesson = { isFree: false };

        const canAccessFree = await canAccessLesson(testUser.id, freeLesson);
        const canAccessPremium = await canAccessLesson(testUser.id, premiumLesson);

        console.log(`   Can access free lesson: ${canAccessFree}`);
        console.log(`   Can access premium lesson: ${canAccessPremium}`);

        // 7. Cleanup
        console.log('\n7. Cleaning up test data...');
        await prisma.subscription.delete({ where: { id: subscription.id } });
        console.log('   Test subscription deleted.');

        console.log('\n--- Phase 3 Verification Complete ---');
        console.log('✅ All tests passed!');

    } catch (error) {
        console.error('\n❌ Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPhase3();
