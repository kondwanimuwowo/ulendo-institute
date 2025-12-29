import prisma from '../lib/prisma.js';
import { hashPassword } from '../lib/auth.js';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function createAdmin() {
    try {
        console.log('\n🔐 Create Admin Account\n');

        const email = await question('Admin email: ');
        const name = await question('Admin name: ');
        const password = await question('Admin password: ');

        // Check if user already exists
        const existing = await prisma.user.findUnique({
            where: { email }
        });

        if (existing) {
            console.log('\n❌ Error: User with this email already exists!');
            return;
        }

        const admin = await prisma.user.create({
            data: {
                email,
                name,
                passwordHash: await hashPassword(password),
                role: 'ADMIN'
            }
        });

        console.log('\n✅ Admin account created successfully!');
        console.log(`\nEmail: ${admin.email}`);
        console.log(`Name: ${admin.name}`);
        console.log(`Role: ${admin.role}`);
        console.log('\nYou can now login with these credentials.');

    } catch (error) {
        console.error('\n❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
        rl.close();
    }
}

createAdmin();
