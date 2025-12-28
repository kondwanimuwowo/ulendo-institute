import Layout from '../../components/Layout';
import LessonList from '../../components/LessonList';
import prisma from '../../lib/prisma.js';
import { getAuthToken, verifyToken } from '../../lib/auth.js';
import { getActiveSubscription } from '../../lib/subscription.js';


export default function CoursePage({ course, isSubscribed }) {
    if (!course) {
        return (
            <Layout>
                <div className="section-padding text-center">
                    <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">Course Not Found</h1>
                    <p className="text-gray-600">This course doesn't exist or has been removed.</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="section-padding bg-primary-950">
                <div className="container-custom">
                    <div className="max-w-4xl">
                        {/* Category & Free Badge */}
                        <div className="flex gap-2 mb-4">
                            <span className="inline-block bg-white/20 text-white text-sm font-semibold px-4 py-1 rounded-full">
                                {course.category.name}
                            </span>
                            {course.isFree && (
                                <span className="inline-block bg-green-500 text-white text-sm font-bold px-4 py-1 rounded-full">
                                    FREE COURSE
                                </span>
                            )}
                        </div>

                        <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6">
                            {course.title}
                        </h1>

                        <p className="text-xl text-primary-50 mb-8">
                            {course.description}
                        </p>

                        {/* Course Meta */}
                        <div className="flex items-center text-white/90">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xl mr-3">
                                {course.instructor.name.charAt(0)}
                            </div>
                            <div>
                                <p className="font-semibold">Instructor</p>
                                <p className="text-white">{course.instructor.name}</p>
                            </div>
                            <div className="ml-8">
                                <p className="font-semibold">Lessons</p>
                                <p className="text-white">{course.lessons.length} lessons</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container-custom section-padding">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* First Lesson Preview (if available) */}
                        {course.lessons.length > 0 && course.lessons[0].isFree && (
                            <div className="mb-12">
                                <h2 className="text-2xl font-display font-bold mb-4">Free Preview</h2>
                                <div className="bg-black rounded-lg overflow-hidden aspect-video">
                                    {course.lessons[0].videoUrl && (
                                        <iframe
                                            className="w-full h-full"
                                            src={course.lessons[0].videoUrl.replace('watch?v=', 'embed/')}
                                            title={course.lessons[0].title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    )}
                                </div>
                                <h3 className="text-xl font-bold mt-4">{course.lessons[0].title}</h3>
                            </div>
                        )}

                        {/* Course Curriculum */}
                        <div>
                            <h2 className="text-2xl font-display font-bold mb-6">Course Curriculum</h2>
                            <LessonList lessons={course.lessons} isSubscribed={isSubscribed || course.isFree} courseSlug={course.slug} />

                            {/* Subscription Prompt or Access Confirmation */}
                            {isSubscribed || course.isFree ? (
                                <div className={`card ${course.isFree ? 'bg-blue-50 border-blue-200' : 'bg-green-50 border-green-200'} border-2 mt-8`}>
                                    <h3 className={`text-xl font-display font-bold mb-2 ${course.isFree ? 'text-blue-800' : 'text-green-800'}`}>
                                        {course.isFree ? '✨ Free Access' : '✓ Full Access Unlocked'}
                                    </h3>
                                    <p className={course.isFree ? 'text-blue-700' : 'text-green-700'}>
                                        {course.isFree
                                            ? 'This course is free for everyone. Enjoy your learning!'
                                            : 'You have an active subscription. Enjoy all lessons in this course!'}
                                    </p>
                                </div>
                            ) : (
                                <div className="card bg-slate-50 border-2 border-slate-100 mt-8">
                                    <h3 className="text-xl font-display font-bold mb-2">
                                        🔒 Unlock Full Access
                                    </h3>
                                    <p className="text-gray-700 mb-4">
                                        Subscribe to get unlimited access to this course and all other courses on the platform.
                                    </p>
                                    <a href="/pricing" className="btn btn-primary">
                                        View Pricing Plans
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Instructor Bio */}
                        <div className="card sticky top-24">
                            <h3 className="text-xl font-display font-bold mb-4">About the Instructor</h3>

                            <div className="flex items-center mb-4">
                                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 text-3xl font-bold mr-4">
                                    {course.instructor.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{course.instructor.name}</p>
                                </div>
                            </div>

                            {course.instructor.instructorBio && (
                                <p className="text-gray-600 text-sm mb-4">
                                    {course.instructor.instructorBio}
                                </p>
                            )}

                            {/* Social Links (if available) */}
                            {course.instructor.instructorLinks && (
                                <div className="flex space-x-3 pt-4 border-t border-gray-200">
                                    {course.instructor.instructorLinks.linkedin && (
                                        <a
                                            href={course.instructor.instructorLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-primary-600"
                                        >
                                            LinkedIn
                                        </a>
                                    )}
                                    {course.instructor.instructorLinks.twitter && (
                                        <a
                                            href={course.instructor.instructorLinks.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-primary-600"
                                        >
                                            Twitter
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export async function getServerSideProps({ params, req }) {
    try {
        // Check user subscription status
        let isSubscribed = false;
        const token = getAuthToken(req);
        if (token) {
            const decoded = verifyToken(token);
            if (decoded?.userId) {
                const subscription = await getActiveSubscription(decoded.userId);
                isSubscribed = !!subscription;
            }
        }

        const course = await prisma.course.findUnique({
            where: { slug: params.slug },
            include: {
                instructor: {
                    select: {
                        id: true,
                        name: true,
                        instructorBio: true,
                        instructorPhoto: true,
                        instructorLinks: true,
                    },
                },
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    },
                },
                lessons: {
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        title: true,
                        videoUrl: true,
                        order: true,
                        isFree: true,
                    },
                },
            },
        });

        if (!course || !course.published) {
            return {
                props: {
                    course: null,
                    isSubscribed: false,
                },
            };
        }

        return {
            props: {
                course: JSON.parse(JSON.stringify(course)),
                isSubscribed,
            },
        };
    } catch (error) {
        console.error('Error fetching course:', error);
        return {
            props: {
                course: null,
                isSubscribed: false,
            },
        };
    }
}
