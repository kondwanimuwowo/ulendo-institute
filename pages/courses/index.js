import Layout from '../../components/Layout';
import CourseCard from '../../components/CourseCard';
import prisma from '../../lib/prisma';

export default function CoursesIndex({ courses, categories }) {
    return (
        <Layout>
            {/* Header */}
            <section className="section-padding bg-primary-950">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-4">
                        Browse All Courses
                    </h1>
                    <p className="text-xl text-primary-50">
                        Explore our comprehensive library of professional development courses
                    </p>
                </div>
            </section>

            {/* Course Grid */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-600 text-xl">No courses available yet. Check back soon!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {courses.map((course) => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        const courses = await prisma.course.findMany({
            where: { published: true },
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        instructorPhoto: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                _count: {
                    select: { lessons: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });

        return {
            props: {
                courses: JSON.parse(JSON.stringify(courses)),
                categories: JSON.parse(JSON.stringify(categories)),
            },
        };
    } catch (error) {
        console.error('Error fetching courses:', error);
        return {
            props: {
                courses: [],
                categories: [],
            },
        };
    }
}
