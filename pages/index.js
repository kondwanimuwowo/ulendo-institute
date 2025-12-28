import Layout from '../components/Layout';
import HeroWithCTA from '../components/HeroWithCTA';
import CourseCard from '../components/CourseCard';
import PricingTable from '../components/PricingTable';
import prisma from '../lib/prisma';

export default function Home({ courses, plans }) {
    return (
        <Layout>
            {/* Hero Section */}
            <HeroWithCTA />

            {/* Program Summary */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
                            What You'll Gain
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Master the skills that matter most in today's professional world
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.362 1.636l-.707.707M21 12h-1M17.636 17.636l-.707-.707M12 21v-1m-6.362-1.636l.707-.707M3 12h1m2.636-6.364l.707.707"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2">Expert Instruction</h3>
                            <p className="text-gray-600">
                                Learn from industry leaders with decades of real-world experience
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2">Learn at Your Pace</h3>
                            <p className="text-gray-600">
                                Access all courses 24/7 and learn on your own schedule
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2">Certification</h3>
                            <p className="text-gray-600">
                                Earn certificates to showcase your new skills
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Courses */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
                            Featured Courses
                        </h2>
                        <p className="text-xl text-gray-600">
                            Start your transformation today
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Instructors */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
                            World-Class Instructors
                        </h2>
                        <p className="text-xl text-gray-600">
                            Learn from the best in the industry
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                        {/* Dario */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 text-5xl font-bold mb-4">
                                D
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-2">Dario Chongolo</h3>
                            <p className="text-gray-600 mb-4">
                                Leadership expert with 15+ years of experience. Author of "The Game Changer" and international speaker.
                            </p>
                        </div>

                        {/* Taonga */}
                        <div className="flex flex-col items-center text-center">
                            <div className="w-32 h-32 flex-shrink-0 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 text-5xl font-bold mb-4">
                                T
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-2">Taonga Joseph Zulu</h3>
                            <p className="text-gray-600 mb-4">
                                Personal development coach passionate about helping people discover their purpose and unlock their potential.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Preview */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-gray-600">
                            Choose the plan that works for you
                        </p>
                    </div>

                    {plans && plans.length > 0 && <PricingTable plans={plans} />}
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-display font-black mb-4">
                            Student Success Stories
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: 'Sarah M.', text: 'This course completely transformed how I approach leadership. The practical insights from Dario are invaluable!', title: 'Marketing Director' },
                            { name: 'John K.', text: 'I discovered my true purpose through Taonga\'s course. It was a life-changing experience.', title: 'Entrepreneur' },
                            { name: 'Grace L.', text: 'The pitch deck course helped me secure funding for my startup. Highly recommend!', title: 'Startup Founder' },
                        ].map((testimonial, index) => (
                            <div key={index} className="card bg-gray-50">
                                <div className="flex items-center mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                                <div>
                                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                                    <p className="text-sm text-gray-600">{testimonial.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="section-padding bg-primary-900">
                <div className="container-custom text-center">
                    <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6">
                        Ready to Transform Your Career?
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Join thousands of professionals who are mastering essential skills
                    </p>
                    <a href="/pricing" className="btn bg-white text-primary-950 hover:bg-gray-100 text-lg px-8 py-4 inline-block">
                        Get Started Today
                    </a>
                </div>
            </section>
        </Layout>
    );
}

export async function getServerSideProps() {
    try {
        // Fetch published courses with instructor and category
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
            },
            orderBy: { createdAt: 'desc' },
            take: 3,
        });

        // Fetch active plans
        const plans = await prisma.plan.findMany({
            where: { isActive: true },
            orderBy: { priceCents: 'asc' },
        });

        return {
            props: {
                courses: JSON.parse(JSON.stringify(courses)),
                plans: JSON.parse(JSON.stringify(plans)),
            },
        };
    } catch (error) {
        console.error('Error in getServerSideProps:', error);
        return {
            props: {
                courses: [],
                plans: [],
            },
        };
    }
}
