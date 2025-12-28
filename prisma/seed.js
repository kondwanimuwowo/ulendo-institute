const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create Admin User
    const adminPasswordHash = await bcrypt.hash('password123', 10);
    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            name: 'Admin User',
            passwordHash: adminPasswordHash,
            role: 'ADMIN',
            instructorApproved: false,
        },
    });
    console.log('✅ Created admin user:', admin.email);

    // Create Approved Instructors
    const instructorPasswordHash = await bcrypt.hash('password123', 10);

    const dario = await prisma.user.upsert({
        where: { email: 'dario@example.com' },
        update: {},
        create: {
            email: 'dario@example.com',
            name: 'Dario Chongolo',
            passwordHash: instructorPasswordHash,
            role: 'INSTRUCTOR',
            instructorApproved: true,
            instructorBio: 'Leadership expert with 15+ years of experience helping individuals and teams reach their full potential. Author of "The Game Changer" and international speaker.',
            instructorPhoto: null,
            instructorLinks: {
                linkedin: 'https://linkedin.com/in/dario-chongolo',
                twitter: 'https://twitter.com/dariochongolo',
            },
        },
    });
    console.log('✅ Created instructor:', dario.email);

    const taonga = await prisma.user.upsert({
        where: { email: 'taonga@example.com' },
        update: {},
        create: {
            email: 'taonga@example.com',
            name: 'Taonga Joseph Zulu',
            passwordHash: instructorPasswordHash,
            role: 'INSTRUCTOR',
            instructorApproved: true,
            instructorBio: 'Personal development coach and motivational speaker. Passionate about helping people discover their purpose and unlock their true potential.',
            instructorPhoto: null,
            instructorLinks: {
                linkedin: 'https://linkedin.com/in/taonga-zulu',
                instagram: 'https://instagram.com/taongazulu',
            },
        },
    });
    console.log('✅ Created instructor:', taonga.email);

    // Create Pending Instructor Applicant
    const pendingInstructor = await prisma.user.upsert({
        where: { email: 'pending_instructor@example.com' },
        update: {},
        create: {
            email: 'pending_instructor@example.com',
            name: 'Pending Instructor',
            passwordHash: instructorPasswordHash,
            role: 'STUDENT',
            instructorApproved: false,
            instructorBio: 'Aspiring instructor waiting for admin approval.',
        },
    });
    console.log('✅ Created pending instructor application:', pendingInstructor.email);

    // Create Categories
    const leadership = await prisma.category.upsert({
        where: { slug: 'leadership' },
        update: {},
        create: {
            name: 'Leadership',
            slug: 'leadership',
        },
    });

    const personalDev = await prisma.category.upsert({
        where: { slug: 'personal-development' },
        update: {},
        create: {
            name: 'Personal Development',
            slug: 'personal-development',
        },
    });

    const creativeSkills = await prisma.category.upsert({
        where: { slug: 'creative-skills' },
        update: {},
        create: {
            name: 'Creative Skills',
            slug: 'creative-skills',
        },
    });
    console.log('✅ Created categories');

    // Create Sample Courses
    const gameChangerCourse = await prisma.course.upsert({
        where: { slug: 'the-game-changer' },
        update: {},
        create: {
            title: 'The Game Changer',
            slug: 'the-game-changer',
            description: 'Transform your leadership approach and become the leader your team needs. This comprehensive course covers essential leadership principles, decision-making strategies, and team-building techniques that will elevate your career and impact.',
            categoryId: leadership.id,
            instructorId: dario.id,
            published: true,
        },
    });

    const purposeCourse = await prisma.course.upsert({
        where: { slug: 'how-to-discover-your-purpose' },
        update: {},
        create: {
            title: 'How to Discover Your Purpose',
            slug: 'how-to-discover-your-purpose',
            description: 'Embark on a transformative journey to uncover your life\'s purpose. Through guided exercises, self-reflection, and proven frameworks, you\'ll gain clarity on your values, passions, and unique contribution to the world.',
            categoryId: personalDev.id,
            instructorId: taonga.id,
            published: true,
            isFree: true,
        },
    });


    const canvaCourse = await prisma.course.upsert({
        where: { slug: 'how-to-create-a-winning-pitch-deck' },
        update: {},
        create: {
            title: 'How to Create a Winning Pitch Deck in Canva',
            slug: 'how-to-create-a-winning-pitch-deck',
            description: 'Master the art of creating compelling pitch decks that win investors and stakeholders. Learn design principles, storytelling techniques, and Canva best practices to present your ideas with confidence and clarity.',
            categoryId: creativeSkills.id,
            instructorId: dario.id,
            published: true,
        },
    });
    console.log('✅ Created sample courses');

    // Create Sample Lessons
    await prisma.lesson.create({
        data: {
            title: 'Introduction to Leadership Excellence',
            content: `# Welcome to The Game Changer

In this introductory lesson, we'll explore what makes a truly effective leader in today's fast-paced world.

## Key Topics
- The modern leadership landscape
- Self-awareness as a foundation
- Creating a vision that inspires

## Learning Outcomes
By the end of this lesson, you'll understand the core principles that separate good leaders from great ones.`,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            order: 1,
            courseId: gameChangerCourse.id,
            isFree: true,
        },
    });

    await prisma.lesson.create({
        data: {
            title: 'Understanding Your Core Values',
            content: `# Discovering Your Purpose Starts Here

Your core values are the compass that guides your life decisions. Let's explore how to identify and honor them.

## In This Lesson
- What are core values?
- Exercise: Identifying your top 5 values
- Aligning your life with your values

## Reflection
Take time to journal about the values that resonate most deeply with you.`,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            order: 1,
            courseId: purposeCourse.id,
            isFree: true,
        },
    });

    await prisma.lesson.create({
        data: {
            title: 'Pitch Deck Fundamentals',
            content: `# Creating Your First Pitch Deck

A winning pitch deck tells a compelling story in 10-15 slides. Let's break down the essential components.

## Essential Slides
1. Problem
2. Solution
3. Market Opportunity
4. Business Model
5. Traction

## Canva Setup
We'll walk through setting up your Canva workspace and choosing the right template.`,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            order: 1,
            courseId: canvaCourse.id,
            isFree: true,
        },
    });
    console.log('✅ Created sample lessons');

    // Create Sample Plans
    const monthlyPlan = await prisma.plan.upsert({
        where: { slug: 'monthly-access' },
        update: {},
        create: {
            name: 'Monthly Access',
            slug: 'monthly-access',
            priceCents: 2900, // $29.00
            interval: 'MONTH',
            trialDays: 0,
            features: {
                includes: [
                    'Access to all published courses',
                    'New course releases',
                    'Community forum access',
                    'Certificate of completion',
                    'Cancel anytime',
                ],
            },
            isActive: true,
        },
    });

    const annualPlan = await prisma.plan.upsert({
        where: { slug: 'annual-access' },
        update: {},
        create: {
            name: 'Annual Access',
            slug: 'annual-access',
            priceCents: 29000, // $290.00 (save $58)
            interval: 'YEAR',
            trialDays: 0,
            features: {
                includes: [
                    'Access to all published courses',
                    'New course releases',
                    'Community forum access',
                    'Certificate of completion',
                    'Priority support',
                    'Early access to new features',
                    'Save $58 per year',
                ],
            },
            isActive: true,
        },
    });
    console.log('✅ Created sample plans');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📧 Login Credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Instructors: dario@example.com / password123');
    console.log('            taonga@example.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
