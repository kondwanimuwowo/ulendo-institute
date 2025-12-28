import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';
import Layout from '../components/Layout';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { user, refreshUser } = useAuth();

    // If already logged in, redirect
    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                let errorMessage = 'Signup failed';
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.error || errorMessage;
                } catch (e) {
                    errorMessage = `Server error (${res.status}). Please try again later.`;
                }
                throw new Error(errorMessage);
            }

            const data = await res.json();


            // Successfully signed up and logged in
            await refreshUser();
            router.push('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                    <div className="text-center">
                        <h2 className="mt-6 text-3xl font-display font-black text-primary-950">
                            Start Your Journey
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 font-medium">
                            Already have an account?{' '}
                            <Link href="/login" className="text-primary-600 hover:text-primary-800 font-bold underline transition-colors">
                                Log in instead
                            </Link>
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="full-name" className="block text-sm font-bold text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                id="full-name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm"
                                placeholder="Dario Chongolo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-bold text-gray-700 mb-1">
                                Email Address
                            </label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-1">
                                Password (min. 8 characters)
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirm-password" className="block text-sm font-bold text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <input
                                id="confirm-password"
                                name="confirm-password"
                                type="password"
                                required
                                className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm transition-all shadow-sm"
                                placeholder="••••••••"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-black rounded-lg text-white bg-primary-950 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {loading ? 'Creating Account...' : 'Enroll Now'}
                            </button>
                        </div>
                    </form>

                    <p className="text-xs text-center text-gray-500 mt-6">
                        By signing up, you agree to our{' '}
                        <a href="#" className="underline">Terms of Service</a> and{' '}
                        <a href="#" className="underline">Privacy Policy</a>.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
