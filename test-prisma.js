require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    log: ['query', 'info'],
});

async function main() {
    console.log('Testing Prisma connection...');
    try {
        const plans = await prisma.plan.findMany();
        console.log('✅ Success! Found plans:', plans.length);
        console.log(plans);
    } catch (error) {
        console.error('❌ Connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
