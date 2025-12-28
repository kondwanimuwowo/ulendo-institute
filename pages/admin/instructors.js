import { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function AdminInstructors() {
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // ID of user being processed

    const fetchApplicants = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/instructors');
            if (!res.ok) throw new Error('Failed to fetch applicants');
            const data = await res.json();
            setApplicants(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplicants();
    }, []);

    const handleAction = async (userId, approve) => {
        setActionLoading(userId);
        try {
            const res = await fetch('/api/admin/instructors/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, approve }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Action failed');
            }

            // Refresh list
            await fetchApplicants();
        } catch (err) {
            alert(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <ProtectedRoute adminOnly={true}>
            <Layout>
                <Head>
                    <title>Manage Instructors | Admin Dashboard</title>
                </Head>

                <header className="bg-primary-950 section-padding py-12">
                    <div className="container-custom">
                        <h1 className="text-3xl font-display font-black text-white">Manage Instructors</h1>
                        <p className="text-primary-100">Review and approve instructor applications.</p>
                    </div>
                </header>

                <main className="section-padding bg-gray-50 min-h-screen">
                    <div className="container-custom">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-950"></div>
                            </div>
                        ) : error ? (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-6 rounded-xl text-center">
                                {error}
                            </div>
                        ) : applicants.length === 0 ? (
                            <div className="bg-white border border-gray-200 p-20 rounded-2xl text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">No applications found</h3>
                                <p className="text-gray-500">There are currently no instructor applications to review.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6">
                                {applicants.map((app) => (
                                    <div key={app.id} className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                                            <div className="flex-shrink-0">
                                                {app.instructorPhoto ? (
                                                    <img
                                                        src={app.instructorPhoto}
                                                        alt={app.name}
                                                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-100"
                                                    />
                                                ) : (
                                                    <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center text-primary-950 font-bold text-2xl">
                                                        {app.name?.[0] || 'U'}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-grow">
                                                <div className="flex flex-wrap items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-display font-black text-gray-900">{app.name}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${app.instructorApproved ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {app.instructorApproved ? 'Approved' : 'Pending'}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        Applied on {new Date(app.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>

                                                <p className="text-gray-600 mb-4 italic">"{app.instructorBio}"</p>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                                                    <div className="flex items-center gap-1">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                        </svg>
                                                        {app.email}
                                                    </div>
                                                    {app.instructorLinks?.website && (
                                                        <a href={app.instructorLinks.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-600 hover:underline">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.172 13.828a4 4 0 015.656 0l4-4a4 4 0 115.656 5.656l-1.101 1.101" />
                                                            </svg>
                                                            Website
                                                        </a>
                                                    )}
                                                    {app.instructorLinks?.linkedin && (
                                                        <a href={app.instructorLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary-600 hover:underline">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                                                            </svg>
                                                            LinkedIn
                                                        </a>
                                                    )}
                                                </div>

                                                <div className="flex gap-3">
                                                    {!app.instructorApproved && (
                                                        <button
                                                            onClick={() => handleAction(app.id, true)}
                                                            disabled={actionLoading === app.id}
                                                            className="btn btn-primary px-6 py-2"
                                                        >
                                                            {actionLoading === app.id ? 'Approving...' : 'Approve Application'}
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleAction(app.id, false)}
                                                        disabled={actionLoading === app.id}
                                                        className="btn border border-red-200 text-red-600 hover:bg-red-50 px-6 py-2"
                                                    >
                                                        {actionLoading === app.id ? 'Processing...' : (app.instructorApproved ? 'Revoke Approval' : 'Reject')}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </Layout>
        </ProtectedRoute>
    );
}
