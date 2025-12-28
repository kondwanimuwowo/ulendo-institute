import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/ProtectedRoute';
import ProtectedRoute from '../../../components/ProtectedRoute';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

export default function CourseEditor() {
    const router = useRouter();
    const { id } = router.query;
    const [course, setCourse] = useState(null);
    const [lessons, setLessons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showLessonForm, setShowLessonForm] = useState(false);

    useEffect(() => {
        if (id) {
            fetchCourse();
        }
    }, [id]);

    const fetchCourse = async () => {
        try {
            const res = await fetch(`/api/instructor/courses/${id}`);
            if (res.ok) {
                const data = await res.json();
                setCourse(data.course);
                setLessons(data.course.lessons || []);
            }
        } catch (error) {
            console.error('Failed to fetch course:', error);
        } finally {
            setLoading(false);
        }
    };

    const togglePublish = async () => {
        try {
            const res = await fetch(`/api/instructor/courses/${id}/publish`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !course.published })
            });

            if (res.ok) {
                setCourse({ ...course, published: !course.published });
            }
        } catch (error) {
            console.error('Failed to toggle publish:', error);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600">Loading course...</p>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    if (!course) {
        return (
            <ProtectedRoute>
                <Layout>
                    <div className="min-h-screen flex items-center justify-center">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold mb-2">Course Not Found</h1>
                            <Link href="/instructor" className="text-primary-600 hover:underline">
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </Layout>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <Layout>
                <div className="bg-gray-50 min-h-screen py-12">
                    <div className="container-custom max-w-5xl">
                        <Link href="/instructor" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>

                        {/* Course Header */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h1 className="text-3xl font-display font-bold mb-2">{course.title}</h1>
                                    <p className="text-gray-600">{course.description}</p>
                                </div>
                                <button
                                    onClick={togglePublish}
                                    className={`btn ${course.published ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white`}
                                >
                                    {course.published ? (
                                        <><Eye className="w-4 h-4 mr-2" /> Published</>
                                    ) : (
                                        <><EyeOff className="w-4 h-4 mr-2" /> Draft</>
                                    )}
                                </button>
                            </div>
                            <div className="flex gap-4 text-sm text-gray-600">
                                <span>{lessons.length} lessons</span>
                                <span>•</span>
                                <span>{course.category?.name}</span>
                            </div>
                        </div>

                        {/* Lessons Section */}
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold">Lessons</h2>
                                <button
                                    onClick={() => setShowLessonForm(!showLessonForm)}
                                    className="btn btn-primary"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Lesson
                                </button>
                            </div>

                            {showLessonForm && (
                                <LessonForm
                                    courseId={id}
                                    onSuccess={() => {
                                        setShowLessonForm(false);
                                        fetchCourse();
                                    }}
                                    onCancel={() => setShowLessonForm(false)}
                                />
                            )}

                            {lessons.length > 0 ? (
                                <div className="space-y-3">
                                    {lessons.map((lesson, index) => (
                                        <div
                                            key={lesson.id}
                                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                                        >
                                            <div className="flex items-center gap-4">
                                                <span className="text-gray-400 font-mono text-sm">{index + 1}</span>
                                                <div>
                                                    <h3 className="font-semibold">{lesson.title}</h3>
                                                    <div className="flex gap-2 mt-1">
                                                        <span className={`text-xs px-2 py-1 rounded-full ${lesson.isFree
                                                                ? 'bg-green-100 text-green-700'
                                                                : 'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {lesson.isFree ? 'Free' : 'Premium'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button className="p-2 hover:bg-gray-100 rounded-lg">
                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                </button>
                                                <button className="p-2 hover:bg-red-50 rounded-lg">
                                                    <Trash2 className="w-4 h-4 text-red-600" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <p>No lessons yet. Add your first lesson to get started!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}

function LessonForm({ courseId, onSuccess, onCancel }) {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        videoUrl: '',
        isFree: false
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/instructor/courses/${courseId}/lessons`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Failed to create lesson');
            }

            onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-6 space-y-4">
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title *</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="input w-full"
                    placeholder="e.g., Introduction to HTML"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={4}
                    className="input w-full"
                    placeholder="Lesson content (supports HTML)"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube)</label>
                <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="input w-full"
                    placeholder="https://www.youtube.com/watch?v=..."
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="lessonFree"
                    checked={formData.isFree}
                    onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                    className="w-4 h-4"
                />
                <label htmlFor="lessonFree" className="text-sm text-gray-700">
                    Make this lesson free (preview)
                </label>
            </div>

            <div className="flex gap-3">
                <button type="submit" disabled={loading} className="btn btn-primary">
                    {loading ? 'Creating...' : 'Create Lesson'}
                </button>
                <button type="button" onClick={onCancel} className="btn bg-gray-200 hover:bg-gray-300">
                    Cancel
                </button>
            </div>
        </form>
    );
}
