require('dotenv').config();
const { execSync } = require('child_process');

console.log('DATABASE_URL:', process.env.DATABASE_URL.substring(0, 30) + '...');

try {
    console.log('\n Step 1: Generating Prisma Client...');
    execSync('npx prisma db push', {
        stdio: 'inherit',
        env: process.env,
        cwd: __dirname
    });
    console.log('✅ Database schema pushed successfully!');
} catch (error) {
    console.error('❌ Failed');
    process.exit(1);
}
