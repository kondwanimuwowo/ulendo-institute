import Link from 'next/link';

export default function CourseCard({ course }) {
    return (
        <Link href={`/courses/${course.slug}`} className="block">
            <div className="card h-full transition-smooth hover:shadow-2xl">
                {/* Thumbnail placeholder */}
                <div className="w-full h-48 bg-slate-50 rounded-lg mb-4 flex items-center justify-center border border-slate-100">
                    <svg className="w-16 h-16 icon-xxl text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                </div>

                {/* Category & Type Badge */}
                <div className="flex justify-between items-center mb-3">
                    {course.category && (
                        <span className="inline-block bg-primary-100 text-primary-700 text-xs font-semibold px-3 py-1 rounded-full">
                            {course.category.name}
                        </span>
                    )}
                    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${course.isFree ? 'bg-green-100 text-green-700' : 'bg-primary-950 text-white'}`}>
                        {course.isFree ? 'Free' : 'Premium'}
                    </span>
                </div>


                {/* Title */}
                <h3 className="text-xl font-display font-bold text-gray-900 mb-2 line-clamp-2">
                    {course.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                </p>

                {/* Instructor */}
                {course.instructor && (
                    <div className="flex items-center mt-auto pt-4 border-t border-gray-100">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-900 font-bold text-sm mr-2">
                            {course.instructor.name.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-700 font-medium">
                            {course.instructor.name}
                        </span>
                    </div>
                )}

                {/* Published Status Badge (for instructors) */}
                {!course.published && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                        Draft
                    </span>
                )}
            </div>
        </Link>
    );
}
