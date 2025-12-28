import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../lib/AuthContext';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';

export default function AdminUsers() {
    const { user } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (user?.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchUsers();
    }, [user]);

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users || []);
            }
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

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
                                    <h1 className="text-3xl font-display font-bold mb-2">User Management</h1>
                                    <p className="text-gray-600">View and manage all platform users</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-black text-primary-600">{users.length}</div>
                                    <div className="text-sm text-gray-600">Total Users</div>
                                </div>
                            </div>

                            {/* Search */}
                            <div className="relative mb-6">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search by name or email..."
                                    className="input w-full pl-10"
                                />
                            </div>

                            {loading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="animate-pulse bg-gray-100 h-20 rounded-lg"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Email</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Role</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredUsers.map((u) => (
                                                <tr key={u.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-4">
                                                        <div className="font-medium">{u.name || 'N/A'}</div>
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">{u.email}</td>
                                                    <td className="px-4 py-4">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                                u.role === 'INSTRUCTOR' ? 'bg-blue-100 text-blue-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        {u.role === 'INSTRUCTOR' && (
                                                            <span className={`text-xs px-2 py-1 rounded-full ${u.instructorApproved
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-yellow-100 text-yellow-700'
                                                                }`}>
                                                                {u.instructorApproved ? 'Approved' : 'Pending'}
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-4 text-sm text-gray-600">
                                                        {new Date(u.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
