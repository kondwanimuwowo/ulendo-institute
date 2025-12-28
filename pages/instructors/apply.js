import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useAuth } from '../../lib/AuthContext';

export default function ApplyInstructor() {
    const { user, loading: authLoading } = useAuth();
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState('');
    const [formData, setFormData] = useState({
        bio: '',
        photoUrl: '',
        website: '',
        linkedin: '',
    });
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/instructors/apply');
        }
        if (user) {
            setFormData({
                bio: user.instructorBio || '',
                photoUrl: user.instructorPhoto || '',
                website: user.instructorLinks?.website || '',
                linkedin: user.instructorLinks?.linkedin || '',
            });
        }
    }, [user, authLoading, router]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        setErrorMessage('');

        try {
            const res = await fetch('/api/instructors/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Something went wrong');
            }

            setStatus('success');
        } catch (err) {
            setStatus('error');
            setErrorMessage(err.message);
        }
    };

    if (status === 'success') {
        return (
            <Layout>
                <div className="section-padding bg-white min-h-[60vh] flex items-center">
                    <div className="container-custom max-w-2xl text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-display font-black mb-4">Application Submitted!</h1>
                        <p className="text-gray-600 mb-8">
                            Thank you for applying to become an instructor at Ulendo Institute. Our team will review your application and get back to you via email within 3-5 business days.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="btn btn-primary"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (authLoading) {
        return (
            <Layout>
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-950"></div>
                </div>
            </Layout>
        );
    }

    if (user?.role === 'INSTRUCTOR' && user?.instructorApproved) {
        return (
            <Layout>
                <div className="section-padding bg-white min-h-[60vh] flex items-center text-center">
                    <div className="container-custom max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-display font-black mb-4">You are already an Instructor!</h1>
                        <p className="text-gray-600 mb-8">
                            Welcome back! You have already been approved as an instructor. You can manage your courses in the instructor dashboard.
                        </p>
                        <button onClick={() => router.push('/instructors/dashboard')} className="btn btn-primary">
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    if (user?.instructorBio && !user?.instructorApproved && status !== 'success') {
        return (
            <Layout>
                <div className="section-padding bg-white min-h-[60vh] flex items-center text-center">
                    <div className="container-custom max-w-2xl mx-auto">
                        <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-display font-black mb-4">Application Pending</h1>
                        <p className="text-gray-600 mb-8">
                            We've received your application and it's currently being reviewed by our team. We'll notify you via email once a decision has been made.
                        </p>
                        <button onClick={() => router.push('/')} className="btn border border-gray-300">
                            Return Home
                        </button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className="section-padding bg-primary-950">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-5xl font-display font-black text-white mb-4">
                        Become an Instructor
                    </h1>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto">
                        Share your knowledge with our global community and help shape the future of professional development.
                    </p>
                </div>
            </section>

            <section className="section-padding bg-white">
                <div className="container-custom max-w-3xl">
                    <div className="card">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-sm">
                                    {errorMessage}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Professional Bio
                                </label>
                                <textarea
                                    name="bio"
                                    required
                                    rows="5"
                                    placeholder="Tell us about your background, expertise and teaching philosophy..."
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-950 transition-all text-gray-900"
                                    value={formData.bio}
                                    onChange={handleChange}
                                />
                                <p className="mt-2 text-xs text-gray-500">
                                    Minimum 50 words recommended.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        Profile Photo URL
                                    </label>
                                    <input
                                        type="url"
                                        name="photoUrl"
                                        placeholder="https://example.com/photo.jpg"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-950 transition-all text-gray-900"
                                        value={formData.photoUrl}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        LinkedIn Profile
                                    </label>
                                    <input
                                        type="url"
                                        name="linkedin"
                                        placeholder="https://linkedin.com/in/username"
                                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-950 transition-all text-gray-900"
                                        value={formData.linkedin}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Personal Website / Portfolio
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    placeholder="https://yourwebsite.com"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-950 transition-all text-gray-900"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className={`btn btn-primary w-full text-lg py-4 ${status === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {status === 'loading' ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </Layout>
    );
}
