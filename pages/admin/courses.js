import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';

export default function AdminCourses() {
    const { user } = useAuth();
    const router = useRouter();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchCourses();
    }, [user]);

    const fetchCourses = async () => {
        try {
            const res = await fetch('/api/admin/courses');
            if (res.ok) {
                const data = await res.json();
                setCourses(data.courses || []);
            }
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setLoading(false);
        }
    };

    if (user?.role !== 'ADMIN') {
        return null;
    }

    return (
        <ProtectedRoute>
            <Layout>
                <div className="bg-gray-50 min-h-screen py-12">
                    <div className="container-custom max-w-6xl">
                        <Link href="/admin" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Admin Dashboard
                        </Link>

                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h1 className="text-3xl font-display font-bold mb-2">Course Management</h1>
                                    <p className="text-gray-600">Oversee all platform courses</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-primary-600">{courses.length}</div>
                                    <div className="text-sm text-gray-600">Total Courses</div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="animate-pulse bg-gray-100 h-64 rounded-lg"></div>
                                    ))}
                                </div>
                            ) : courses.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {courses.map((course) => (
                                        <div key={course.id} className="card">
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
                                                        {course.published ? (
                                                            <><Eye className="w-3 h-3 inline mr-1" />Published</>
                                                        ) : (
                                                            <><EyeOff className="w-3 h-3 inline mr-1" />Draft</>
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {course._count?.lessons || 0} lessons
                                                    </span>
                                                </div>
                                                <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                                                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                                                    {course.description}
                                                </p>
                                                <div className="text-xs text-gray-500">
                                                    By {course.instructor?.name || 'Unknown'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No courses yet</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
