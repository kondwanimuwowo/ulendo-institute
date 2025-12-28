require('dotenv').config();
const { execSync } = require('child_process');

console.log('DATABASE_URL loaded:', !!process.env.DATABASE_URL);

try {
    console.log('\nRunning: npx prisma migrate dev --name init');
    execSync('npx prisma migrate dev --name init', {
        stdio: 'inherit',
        env: process.env,
        cwd: __dirname
    });
    console.log('✅ Migration completed!');
} catch (error) {
    console.error('❌ Migration failed');
    process.exit(1);
}
