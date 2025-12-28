import Link from 'next/link';
import { useRouter } from 'next/router';

export default function LessonList({ lessons = [], isSubscribed = false, courseSlug }) {
    const router = useRouter();

    if (!lessons || lessons.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No lessons available yet.
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {lessons.map((lesson) => {
                const isLocked = !lesson.isFree && !isSubscribed;
                const lessonUrl = courseSlug
                    ? `/courses/${courseSlug}/lessons/${lesson.id}`
                    : `/courses/${router.query.slug}/lessons/${lesson.id}`;

                const LessonWrapper = isLocked ? 'div' : Link;
                const wrapperProps = isLocked ? {} : { href: lessonUrl };

                return (
                    <LessonWrapper
                        key={lesson.id}
                        {...wrapperProps}
                        className={`flex items-center justify-between p-4 rounded-lg border transition-smooth ${isLocked
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white border-gray-300 hover:border-primary-400 hover:shadow-md cursor-pointer'
                            }`}
                    >
                        <div className="flex items-center flex-1">
                            {/* Lesson Number */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm mr-4 ${isLocked ? 'bg-gray-300 text-gray-600' : 'bg-primary-600 text-white'
                                }`}>
                                {lesson.order}
                            </div>

                            {/* Lesson Title */}
                            <div className="flex-1">
                                <h4 className={`font-semibold ${isLocked ? 'text-gray-500' : 'text-gray-900'}`}>
                                    {lesson.title}
                                </h4>
                                <div className="flex gap-2 mt-1">
                                    {lesson.isFree && (
                                        <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-2 py-0.5 rounded">
                                            FREE PREVIEW
                                        </span>
                                    )}
                                    {isLocked && (
                                        <span className="inline-block bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded">
                                            PREMIUM
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Lock Icon or Play Button */}
                        <div>
                            {isLocked ? (
                                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                                </svg>
                            ) : (
                                <svg className="w-6 h-6 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"></path>
                                </svg>
                            )}
                        </div>
                    </LessonWrapper>
                );
            })}
        </div>
    );
}

