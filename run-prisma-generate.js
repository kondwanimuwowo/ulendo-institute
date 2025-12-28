require('dotenv').config();
const { execSync } = require('child_process');

console.log('Loading environment variables...');
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);

try {
    console.log('\nRunning: npx prisma generate');
    execSync('npx prisma generate', {
        stdio: 'inherit',
        env: process.env,
        cwd: __dirname
    });
    console.log('✅ Prisma generate completed successfully!');
} catch (error) {
    console.error('❌ Prisma generate failed:', error.message);
    process.exit(1);
}
