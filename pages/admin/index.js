import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Users, BookOpen, DollarSign, UserCheck, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalCourses: 0,
        activeSubscriptions: 0,
        pendingInstructors: 0,
        revenue: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchStats();
    }, [user]);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Failed to fetch stats:', error);
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
                <div className="bg-gray-50 min-h-screen">
                    {/* Header */}
                    <section className="section-padding bg-primary-950 text-white">
                        <div className="container-custom">
                            <h1 className="text-4xl font-display font-black mb-2">
                                Admin Dashboard
                            </h1>
                            <p className="text-primary-100 text-lg">
                                Platform overview and management
                            </p>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mt-8">
                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black">{stats.totalUsers}</div>
                                            <div className="text-xs uppercase tracking-wider opacity-70">Users</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <BookOpen className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black">{stats.totalCourses}</div>
                                            <div className="text-xs uppercase tracking-wider opacity-70">Courses</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black">{stats.activeSubscriptions}</div>
                                            <div className="text-xs uppercase tracking-wider opacity-70">Active Subs</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <UserCheck className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black">{stats.pendingInstructors}</div>
                                            <div className="text-xs uppercase tracking-wider opacity-70">Pending</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="text-3xl font-black">${(stats.revenue / 100).toFixed(0)}</div>
                                            <div className="text-xs uppercase tracking-wider opacity-70">Revenue</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className="section-padding">
                        <div className="container-custom">
                            <h2 className="text-2xl font-display font-bold mb-6">Quick Actions</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Link href="/admin/users" className="card hover:scale-105 transition-smooth">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                            <Users className="w-6 h-6 text-primary-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Manage Users</h3>
                                            <p className="text-sm text-gray-600">View all users</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link href="/admin/courses" className="card hover:scale-105 transition-smooth">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center">
                                            <BookOpen className="w-6 h-6 text-accent-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Manage Courses</h3>
                                            <p className="text-sm text-gray-600">Oversee content</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link href="/admin/instructors" className="card hover:scale-105 transition-smooth relative">
                                    {stats.pendingInstructors > 0 && (
                                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {stats.pendingInstructors}
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                            <UserCheck className="w-6 h-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Instructor Approvals</h3>
                                            <p className="text-sm text-gray-600">Review applications</p>
                                        </div>
                                    </div>
                                </Link>

                                <Link href="/admin/subscriptions" className="card hover:scale-105 transition-smooth">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <DollarSign className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold">Subscriptions</h3>
                                            <p className="text-sm text-gray-600">View payments</p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
