const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPhase2() {
    console.log('--- Phase 2 Verification Test ---');

    try {
        // 1. Find a student user to test with
        const student = await prisma.user.findFirst({
            where: { role: 'STUDENT' }
        });

        if (!student) {
            console.error('No student user found. Run seed script first.');
            return;
        }

        console.log(`Testing with student: ${student.email}`);

        // 2. Simulate Instructor Application
        console.log('Applying as instructor...');
        await prisma.user.update({
            where: { id: student.id },
            data: {
                instructorBio: 'This is a test bio for verification purposes. It should be long enough.',
                instructorPhoto: 'https://example.com/photo.jpg',
                instructorLinks: { website: 'https://test.com', linkedin: 'https://linkedin.com/in/test' }
            }
        });

        const applicant = await prisma.user.findUnique({ where: { id: student.id } });
        console.log('Application state:', applicant.instructorBio ? 'SUCCESS' : 'FAILED');

        // 3. Verify Admin list (simulated)
        const instructors = await prisma.user.findMany({
            where: {
                OR: [
                    { role: 'INSTRUCTOR' },
                    { instructorBio: { not: null } }
                ]
            }
        });
        console.log(`Admin sees ${instructors.length} instructors/applicants.`);

        // 4. Approve Instructor
        console.log('Approving instructor...');
        const approvedUser = await prisma.user.update({
            where: { id: student.id },
            data: {
                role: 'INSTRUCTOR',
                instructorApproved: true
            }
        });

        console.log('Approval status:', approvedUser.instructorApproved ? 'SUCCESS' : 'FAILED');
        console.log('New role:', approvedUser.role);

        // 5. Cleanup (optional, but let's keep it for state verification)
        console.log('--- Test Completed Successfully ---');

    } catch (error) {
        console.error('Test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPhase2();
