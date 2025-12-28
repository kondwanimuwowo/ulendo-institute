import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../lib/AuthContext';
import CourseCard from '../components/CourseCard';
import Link from 'next/link';

export default function Dashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({ enrollments: 0, completed: 0 });
    const [courses, setCourses] = useState([]);
    const [subscription, setSubscription] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch user data with subscription
                const userRes = await fetch('/api/users/me');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setSubscription(userData.user?.subscription);
                }

                // Fetch courses
                const coursesRes = await fetch('/api/courses');
                if (coursesRes.ok) {
                    const data = await coursesRes.json();
                    setCourses(data.courses?.slice(0, 3) || []);
                    setStats({
                        enrollments: data.courses?.length || 0,
                        completed: 0
                    });
                }
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <ProtectedRoute>
            <Layout>
                <div className="bg-gray-50 min-h-screen">
                    <section className="section-padding bg-primary-950 text-white">
                        <div className="container-custom">
                            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                                <div>
                                    <h1 className="text-4xl font-display font-black mb-2">
                                        Welcome back, {user?.name?.split(' ')[0]}!
                                    </h1>
                                    <p className="text-primary-100 text-lg">
                                        Ready to continue your learning journey?
                                    </p>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                                        <div className="text-3xl font-black">{stats.enrollments}</div>
                                        <div className="text-xs uppercase tracking-wider opacity-70">Courses</div>
                                    </div>
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20">
                                        <div className="text-3xl font-black">{stats.completed}</div>
                                        <div className="text-xs uppercase tracking-wider opacity-70">Completed</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="section-padding">
                        <div className="container-custom">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-display font-bold">Your Courses</h2>
                                <Link href="/courses" className="text-primary-600 font-bold hover:underline transition-all">
                                    Browse All
                                </Link>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="animate-pulse bg-white rounded-2xl h-64 border border-gray-100 shadow-sm"></div>
                                    ))}
                                </div>
                            ) : courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {courses.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-12 rounded-2xl text-center border border-gray-100 shadow-sm">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-full mb-4">
                                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No courses yet</h3>
                                    <p className="text-gray-600 mb-6">Explore our library and start learning something new today.</p>
                                    <Link href="/courses" className="btn btn-primary px-8">
                                        Explore Courses
                                    </Link>
                                </div>
                            )}

                            {/* Notifications / Sidebar area */}
                            <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-6">
                                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                        <h3 className="text-lg font-bold mb-4">Upcoming Live Sessions</h3>
                                        <p className="text-gray-500 text-sm italic">No sessions scheduled for this week.</p>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    {subscription?.status === 'ACTIVE' ? (
                                        <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-2xl text-white shadow-lg">
                                            <h3 className="text-lg font-bold mb-2">✓ Active Subscription</h3>
                                            <p className="text-green-100 text-sm mb-1">
                                                {subscription.plan?.name}
                                            </p>
                                            <p className="text-green-100 text-xs opacity-80">
                                                Renews {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                                            </p>
                                        </div>
                                    ) : subscription?.status === 'PENDING' ? (
                                        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-6 rounded-2xl text-white shadow-lg">
                                            <h3 className="text-lg font-bold mb-2">⏳ Payment Pending</h3>
                                            <p className="text-yellow-100 text-sm mb-4 opacity-90">
                                                Check your phone to approve the payment.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="bg-gradient-to-br from-primary-900 to-primary-950 p-6 rounded-2xl text-white shadow-lg">
                                            <h3 className="text-lg font-bold mb-2">No Active Subscription</h3>
                                            <p className="text-primary-100 text-sm mb-4 opacity-80">
                                                Subscribe to unlock all courses.
                                            </p>
                                            <Link href="/pricing" className="btn bg-white text-primary-900 hover:bg-gray-100 w-full">
                                                View Plans
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
