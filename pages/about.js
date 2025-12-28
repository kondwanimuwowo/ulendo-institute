import Layout from '../components/Layout';

export default function About() {
    return (
        <Layout>
            {/* Header */}
            <section className="section-padding bg-primary-950">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6">
                        About Ulendo Institute
                    </h1>
                    <p className="text-xl text-primary-50 max-w-3xl mx-auto">
                        Empowering professionals through world-class online education
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="section-padding bg-white">
                <div className="container-custom max-w-4xl">
                    <h2 className="text-3xl font-display font-black mb-6 text-center">Our Mission</h2>
                    <p className="text-lg text-gray-700 leading-relaxed mb-4">
                        At Ulendo Institute, we believe that everyone deserves access to high-quality education that transforms careers and lives. Our mission is to provide world-class courses in leadership, personal development, and creative skills that empower professionals to reach their full potential.
                    </p>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        We partner with industry experts and thought leaders to create engaging, practical courses that deliver real results. Whether you're looking to advance your career, discover your purpose, or master a new skill, Ulendo Institute is your partner in transformation.
                    </p>
                </div>
            </section>

            {/* Values */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <h2 className="text-3xl font-display font-black mb-12 text-center">Our Values</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card text-center">
                            <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2">Excellence</h3>
                            <p className="text-gray-600">
                                We're committed to delivering only the highest quality content and learning experiences.
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2">Community</h3>
                            <p className="text-gray-600">
                                We foster a supportive learning community where students grow together.
                            </p>
                        </div>

                        <div className="card text-center">
                            <div className="w-16 h-16 bg-primary-950 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                </svg>
                            </div>
                            <h3 className="text-xl font-display font-bold mb-2">Impact</h3>
                            <p className="text-gray-600">
                                We measure success by the real-world transformation our students experience.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="section-padding bg-primary-900">
                <div className="container-custom text-center">
                    <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-6">
                        Join Our Learning Community
                    </h2>
                    <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                        Start your transformation today with unlimited access to all courses
                    </p>
                    <a href="/pricing" className="btn bg-white text-primary-950 hover:bg-gray-100">
                        View Pricing
                    </a>
                </div>
            </section>
        </Layout>
    );
}
