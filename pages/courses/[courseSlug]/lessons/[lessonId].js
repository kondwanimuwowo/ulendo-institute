import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { useAuth } from '../../../lib/AuthContext';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Lock, ChevronRight } from 'lucide-react';

export default function LessonPage() {
    const router = useRouter();
    const { courseSlug, lessonId } = router.query;
    const { user } = useAuth();
    const [lesson, setLesson] = useState(null);
    const [course, setCourse] = useState(null);
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [completing, setCompleting] = useState(false);

    useEffect(() => {
        if (courseSlug && lessonId) {
            fetchLesson();
        }
    }, [courseSlug, lessonId]);

    const fetchLesson = async () => {
        try {
            const res = await fetch(`/api/lessons/${lessonId}?courseSlug=${courseSlug}`);
            if (res.ok) {
                const data = await res.json();
                setLesson(data.lesson);
                setCourse(data.course);
                setHasAccess(data.hasAccess);
            }
        } catch (error) {
            console.error('Failed to fetch lesson:', error);
        } finally {
            setLoading(false);
        }
    };

    const markComplete = async () => {
        if (!user || completing) return;

        setCompleting(true);
        try {
            const res = await fetch(`/api/lessons/${lessonId}/complete`, {
                method: 'POST'
            });
            if (res.ok) {
                // Refresh to update completion status
                fetchLesson();
            }
        } catch (error) {
            console.error('Failed to mark complete:', error);
        } finally {
            setCompleting(false);
        }
    };

    const getYouTubeEmbedUrl = (url) => {
        if (!url) return '';
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
        return `https://www.youtube.com/embed/${videoId}`;
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    if (!lesson || !course) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-2">Lesson Not Found</h1>
                            <Link href="/courses" className="text-primary-600 hover:underline">
                                Browse Courses
                            </Link>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    if (!hasAccess) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                        <div className="max-w-md text-center">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Lock className="w-8 h-8 text-yellow-600" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">🔒 Premium Content</h1>
                            <p className="text-gray-600 mb-6">
                                Subscribe to unlock this lesson and all premium content.
                            </p>
                            <Link href="/pricing" className="btn btn-primary">
                                View Subscription Plans
                            </Link>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    const currentIndex = course.lessons.findIndex(l => l.id === lesson.id);
    const nextLesson = course.lessons[currentIndex + 1];

    return (
        <ProtectedRoute>
            <Layout>
                <div className="bg-gray-50 min-h-screen">
                    {/* Video Section */}
                    <div className="bg-black">
                        <div className="container-custom py-4">
                            <Link
                                href={`/courses/${courseSlug}`}
                                className="flex items-center text-white/80 hover:text-white mb-4"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to {course.title}
                            </Link>
                        </div>

                        {lesson.videoUrl ? (
                            <div className="aspect-video">
                                <iframe
                                    className="w-full h-full"
                                    src={getYouTubeEmbedUrl(lesson.videoUrl)}
                                    title={lesson.title}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        ) : (
                            <div className="aspect-video bg-gray-900 flex items-center justify-center">
                                <p className="text-white/60">No video available for this lesson</p>
                            </div>
                        )}
                    </div>

                    {/* Content Section */}
                    <div className="container-custom py-8">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Main Content */}
                            <div className="lg:col-span-2">
                                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h1 className="text-3xl font-display font-bold mb-2">{lesson.title}</h1>
                                            <p className="text-gray-600">Lesson {currentIndex + 1} of {course.lessons.length}</p>
                                        </div>
                                        {lesson.isCompleted ? (
                                            <div className="flex items-center gap-2 text-green-600">
                                                <CheckCircle className="w-5 h-5" />
                                                <span className="text-sm font-semibold">Completed</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={markComplete}
                                                disabled={completing}
                                                className="btn btn-primary"
                                            >
                                                {completing ? 'Marking...' : 'Mark Complete'}
                                            </button>
                                        )}
                                    </div>

                                    {/* Lesson Content */}
                                    <div
                                        className="prose max-w-none"
                                        dangerouslySetInnerHTML={{ __html: lesson.content }}
                                    />

                                    {/* Next Lesson */}
                                    {nextLesson && (
                                        <div className="mt-8 pt-8 border-t border-gray-200">
                                            <Link
                                                href={`/courses/${courseSlug}/lessons/${nextLesson.id}`}
                                                className="flex items-center justify-between p-4 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                                            >
                                                <div>
                                                    <p className="text-sm text-primary-600 font-semibold mb-1">Next Lesson</p>
                                                    <p className="font-bold">{nextLesson.title}</p>
                                                </div>
                                                <ChevronRight className="w-6 h-6 text-primary-600" />
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Sidebar - Course Navigation */}
                            <div>
                                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-4">
                                    <h3 className="font-bold mb-4">Course Content</h3>
                                    <div className="space-y-2">
                                        {course.lessons.map((l, idx) => (
                                            <Link
                                                key={l.id}
                                                href={`/courses/${courseSlug}/lessons/${l.id}`}
                                                className={`block p-3 rounded-lg transition-colors ${l.id === lesson.id
                                                        ? 'bg-primary-100 border border-primary-200'
                                                        : 'hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${l.isCompleted
                                                            ? 'bg-green-500 text-white'
                                                            : l.id === lesson.id
                                                                ? 'bg-primary-600 text-white'
                                                                : 'bg-gray-200 text-gray-600'
                                                        }`}>
                                                        {l.isCompleted ? '✓' : idx + 1}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className={`text-sm font-semibold truncate ${l.id === lesson.id ? 'text-primary-900' : 'text-gray-900'
                                                            }`}>
                                                            {l.title}
                                                        </p>
                                                        {l.isFree && (
                                                            <span className="text-xs text-green-600">Free</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
