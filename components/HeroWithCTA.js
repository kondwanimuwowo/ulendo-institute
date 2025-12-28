import Link from 'next/link';

export default function HeroWithCTA({
    title = "Transform Your Career Through World-Class Courses",
    subtitle = "Learn from industry experts and join thousands of professionals mastering leadership, personal development, and creative skills",
    ctaText = "Start Learning Today",
    ctaLink = "/pricing",
    socialProof = "Join 1,000+ learners worldwide"
}) {
    return (
        <section className="section-padding bg-primary-950">
            <div className="container-custom text-center">
                <div className="max-w-4xl mx-auto animate-fadeIn">
                    {/* Social Proof */}
                    {socialProof && (
                        <p className="text-primary-300 text-sm font-bold uppercase tracking-widest mb-4">
                            {socialProof}
                        </p>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-8 leading-tight">
                        {title}
                    </h1>

                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-primary-100 mb-10 leading-relaxed font-medium">
                        {subtitle}
                    </p>

                    {/* CTA Button */}
                    <Link
                        href={ctaLink}
                        className="btn bg-white text-primary-950 hover:bg-gray-100 px-8 py-4 inline-block shadow-lg"
                    >
                        {ctaText}
                    </Link>

                    {/* Trust Indicators */}
                    <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/90 text-sm">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 icon-sm mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Cancel anytime
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 icon-sm mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Certificates included
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 icon-sm mr-2 text-green-300" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                            </svg>
                            Lifetime access
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
