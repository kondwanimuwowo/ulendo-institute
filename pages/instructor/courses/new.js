import { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../../components/Layout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewCourse() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: '',
        categoryId: '',
        isFree: false
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/instructor/courses/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to create course');
            }

            router.push(`/instructor/courses/${data.course.id}`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    return (
        <ProtectedRoute>
            <Layout>
                <div className="bg-gray-50 min-h-screen py-12">
                    <div className="container-custom max-w-3xl">
                        <Link href="/instructor" className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Dashboard
                        </Link>

                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h1 className="text-3xl font-display font-bold mb-2">Create New Course</h1>
                            <p className="text-gray-600 mb-8">Fill in the details to create your course</p>

                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Course Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="input w-full"
                                        placeholder="e.g., Introduction to Web Development"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={4}
                                        className="input w-full"
                                        placeholder="Describe what students will learn..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thumbnail URL
                                    </label>
                                    <input
                                        type="url"
                                        name="thumbnail"
                                        value={formData.thumbnail}
                                        onChange={handleChange}
                                        className="input w-full"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        Recommended: 800x450px
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        required
                                        className="input w-full"
                                    >
                                        <option value="">Select a category</option>
                                        <option value="web-development">Web Development</option>
                                        {/* TODO: Fetch categories from API */}
                                    </select>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        name="isFree"
                                        id="isFree"
                                        checked={formData.isFree}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                    />
                                    <label htmlFor="isFree" className="text-sm text-gray-700">
                                        Make this course completely free
                                    </label>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary flex-1"
                                    >
                                        {loading ? 'Creating...' : 'Create Course'}
                                    </button>
                                    <Link href="/instructor" className="btn bg-gray-100 hover:bg-gray-200 text-gray-700">
                                        Cancel
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </Layout>
        </ProtectedRoute>
    );
}
