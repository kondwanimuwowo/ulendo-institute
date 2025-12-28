import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../lib/AuthContext';
import Link from 'next/link';
import { Plus, BookOpen, Users, BarChart } from 'lucide-react';

export default function InstructorDashboard() {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, published: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInstructorData();
    }, []);

    const fetchInstructorData = async () => {
        try {
            const res = await fetch('/api/instructor/courses');
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses || []);
                setStats({
                    totalCourses: data.courses?.length || 0,
                    published: data.courses?.filter(c => c.published).length || 0,
                    totalStudents: 0 // TODO: Calculate from enrollments
                });
            }
        } catch (error) {
            console.error('Failed to fetch instructor data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!user?.instructorApproved) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                        <div className="text-center max-w-md">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-3xl">⏳</span>
                            </div>
                            <h1 className="text-2xl font-bold mb-2">Approval Pending</h1>
                            <p className="text-gray-600">
                                Your instructor application is being reviewed. You'll receive an email once approved.
                            </p>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Layout>
                <div className="bg-gray-50 min-h-screen">
                    {/* Header */}
                    <section className="section-padding bg-primary-950 text-white">
                        <div className="container-custom">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                                <div>
                                    <h1 className="text-4xl font-display font-black mb-2">
                                        Instructor Dashboard
                                    </h1>
                                    <p className="text-primary-100 text-lg">
                                        Manage your courses and content
                                    </p>
                                </div>
                                <Link href="/instructor/courses/new" className="btn bg-accent-500 hover:bg-accent-600 text-white">
                                    <Plus className="w-5 h-5 mr-2" />
                                    Create Course
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black">{stats.totalCourses}</div>
                                            <div className="text-xs uppercase tracking-wider opacity-70">Total Courses</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <BarChart className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black">{stats.published}</div>
                                            <div className="text-xs uppercase tracking-wider opacity-70">Published</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black">{stats.totalStudents}</div>
                                            <div className="text-xs uppercase tracking-wider opacity-70">Students</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Courses List */}
                    <section className="section-padding">
                        <div className="container-custom">
                            <h2 className="text-2xl font-display font-bold mb-6">Your Courses</h2>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="animate-pulse bg-white rounded-2xl h-64 border border-gray-100"></div>
                                    ))}
                                </div>
                            ) : courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courses.map((course) => (
                                        <Link
                                            key={course.id}
                                            href={`/instructor/courses/${course.id}`}
                                            className="card hover:scale-105 transition-smooth"
                                        >
                                            {course.thumbnail && (
                                                <img
                                                    src={course.thumbnail}
                                                    alt={course.title}
                                                    className="w-full h-40 object-cover rounded-t-xl"
                                                />
                                            )}
                                            <div className="p-6">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className={`text-xs px-2 py-1 rounded-full ${course.published
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {course.published ? 'Published' : 'Draft'}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {course._count?.lessons || 0} lessons
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {course.description}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white p-12 rounded-2xl text-center border border-gray-100">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <BookOpen className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">No courses yet</h3>
                                    <p className="text-gray-600 mb-6">
                                        Create your first course and start teaching!
                                    </p>
                                    <Link href="/instructor/courses/new" className="btn btn-primary">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Create Your First Course
                                    </Link>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
