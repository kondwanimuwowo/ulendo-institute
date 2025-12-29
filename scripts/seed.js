import prisma from '../lib/prisma.js';
import { hashPassword } from '../lib/auth.js';

async function main() {
    console.log('🌱 Seeding database...');

    // Create demo instructor
    const instructor = await prisma.user.upsert({
        where: { email: 'instructor@example.com' },
        update: {},
        create: {
            email: 'instructor@example.com',
            name: 'Dr. Sarah Johnson',
            passwordHash: await hashPassword('password123'),
            role: 'INSTRUCTOR',
            instructorApproved: true,
            instructorBio: 'Expert educator with 10+ years of experience in online learning.',
        },
    });

    console.log('✓ Created instructor');

    // Create category
    const category = await prisma.category.upsert({
        where: { slug: 'web-development' },
        update: {},
        create: {
            name: 'Web Development',
            slug: 'web-development',
        },
    });

    console.log('✓ Created category');

    // Create demo course
    const course = await prisma.course.upsert({
        where: { slug: 'intro-to-web-development' },
        update: {},
        create: {
            title: 'Introduction to Web Development',
            slug: 'intro-to-web-development',
            description: 'Learn the fundamentals of web development including HTML, CSS, and JavaScript. Perfect for beginners!',
            thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
            instructorId: instructor.id,
            categoryId: category.id,
            published: true,
            isFree: false,
        },
    });

    console.log('✓ Created course');

    // Create lessons
    await prisma.lesson.upsert({
        where: { id: 'lesson-1-welcome' },
        update: {},
        create: {
            id: 'lesson-1-welcome',
            title: 'Welcome to Web Development',
            content: '<h1>Welcome!</h1><p>In this course, you will learn the fundamentals of web development including HTML, CSS, and JavaScript.</p><p>Get ready to build your first website!</p>',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            order: 1,
            isFree: true,
            courseId: course.id,
        },
    });

    await prisma.lesson.upsert({
        where: { id: 'lesson-2-setup' },
        update: {},
        create: {
            id: 'lesson-2-setup',
            title: 'Setting Up Your Development Environment',
            content: '<h1>Development Environment</h1><p>Learn how to set up your coding environment with VS Code and essential extensions.</p>',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            order: 2,
            isFree: false,
            courseId: course.id,
        },
    });

    await prisma.lesson.upsert({
        where: { id: 'lesson-3-html' },
        update: {},
        create: {
            id: 'lesson-3-html',
            title: 'HTML Fundamentals',
            content: '<h1>HTML Basics</h1><p>Understanding HTML tags, structure, and semantic elements.</p>',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            order: 3,
            isFree: false,
            courseId: course.id,
        },
    });

    await prisma.lesson.upsert({
        where: { id: 'lesson-4-css' },
        update: {},
        create: {
            id: 'lesson-4-css',
            title: 'CSS Styling Basics',
            content: '<h1>CSS Fundamentals</h1><p>Learn how to style your web pages with CSS.</p>',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            order: 4,
            isFree: false,
            courseId: course.id,
        },
    });

    await prisma.lesson.upsert({
        where: { id: 'lesson-5-js' },
        update: {},
        create: {
            id: 'lesson-5-js',
            title: 'JavaScript Introduction',
            content: '<h1>JavaScript Basics</h1><p>Add interactivity to your websites with JavaScript.</p>',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            order: 5,
            isFree: false,
            courseId: course.id,
        },
    });

    console.log('✓ Created 5 lessons (1 free, 4 premium)');

    // Create subscription plans
    const monthlyPlan = await prisma.plan.upsert({
        where: { slug: 'monthly-zmw' },
        update: {},
        create: {
            name: 'Monthly Access',
            slug: 'monthly-zmw',
            priceCents: 50000, // ZMW 500.00
            interval: 'MONTH',
            trialDays: 0,
            features: {
                features: [
                    'Access to all premium courses',
                    'Unlimited lesson views',
                    'Progress tracking',
                    'Certificate of completion',
                    'Cancel anytime'
                ]
            },
            isActive: true,
        },
    });

    const yearlyPlan = await prisma.plan.upsert({
        where: { slug: 'yearly-zmw' },
        update: {},
        create: {
            name: 'Yearly Access',
            slug: 'yearly-zmw',
            priceCents: 500000, // ZMW 5000.00
            interval: 'YEAR',
            trialDays: 0,
            features: {
                features: [
                    'Access to all premium courses',
                    'Unlimited lesson views',
                    'Progress tracking',
                    'Certificate of completion',
                    'Priority support',
                    'Save 17% vs monthly'
                ]
            },
            isActive: true,
        },
    });

    console.log('✓ Created subscription plans (Monthly: ZMW 500, Yearly: ZMW 5000)');
    console.log('✅ Seeding complete!');
    console.log('\n📚 Demo course created:');
    console.log(`   - Title: ${course.title}`);
    console.log(`   - Slug: ${course.slug}`);
    console.log(`   - Instructor: ${instructor.name}`);
    console.log(`   - Lessons: 5 (1 free preview)`);
    console.log('\n💳 Subscription plans:');
    console.log(`   - Monthly: ZMW 500/month`);
    console.log(`   - Yearly: ZMW 5000/year (save 17%)`);

}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
