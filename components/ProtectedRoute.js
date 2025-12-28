import { useAuth } from '../lib/AuthContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, adminOnly = false }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push('/login');
            } else if (adminOnly && user.role !== 'ADMIN') {
                router.push('/');
            }
        }
    }, [user, loading, router, adminOnly]);

    if (loading || !user || (adminOnly && user.role !== 'ADMIN')) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-950"></div>
            </div>
        );
    }

    return children;
}
