import Layout from '../components/Layout';

export default function FAQ() {
    const faqs = [
        {
            question: 'What is Ulendo Institute?',
            answer: 'Ulendo Institute is an online learning platform offering world-class courses in leadership, personal development, and creative skills. We partner with industry experts to deliver transformative education.',
        },
        {
            question: 'How does the subscription work?',
            answer: 'With a subscription, you get unlimited access to all published courses on the platform. You can choose between monthly or annual billing. Cancel anytime with no penalties.',
        },
        {
            question: 'Can I cancel my subscription?',
            answer: 'Yes! You can cancel your subscription at any time from your account settings. You\'ll continue to have access until the end of your current billing period.',
        },
        {
            question: 'Do you offer refunds?',
            answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with the courses, contact our support team within 30 days of your purchase for a full refund.',
        },
        {
            question: 'Are courses self-paced?',
            answer: 'Yes! All courses are completely self-paced. You can start, pause, and resume courses at any time. Learn on your own schedule.',
        },
        {
            question: 'Do I get a certificate?',
            answer: 'Yes! Upon completing a course, you\'ll receive a certificate of completion that you can download and share on LinkedIn or your resume.',
        },
        {
            question: 'Can I access courses on mobile?',
            answer: 'Absolutely! Our platform is fully responsive and works great on all devices including smartphones and tablets.',
        },
        {
            question: 'How many courses can I take?',
            answer: 'With an active subscription, you have unlimited access to all published courses. Take as many as you want!',
        },
        {
            question: 'Are new courses added regularly?',
            answer: 'Yes! We regularly add new courses across all categories. As a subscriber, you get instant access to all new releases.',
        },
        {
            question: 'How do I become an instructor?',
            answer: 'We\'re always looking for expert instructors! Visit our "Become an Instructor" page to submit an application. Our team will review it and get back to you.',
        },
    ];

    return (
        <Layout>
            {/* Header */}
            <section className="section-padding bg-primary-950">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-primary-50">
                        Everything you need to know about Ulendo Institute
                    </p>
                </div>
            </section>

            {/* FAQ List */}
            <section className="section-padding bg-white">
                <div className="container-custom max-w-4xl">
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <details key={index} className="card">
                                <summary className="font-semibold text-lg cursor-pointer flex items-center justify-between">
                                    {faq.question}
                                    <svg className="w-5 h-5 text-gray-400 ml-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </summary>
                                <p className="text-gray-600 mt-4 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact CTA */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom max-w-3xl text-center">
                    <h2 className="text-3xl font-display font-black mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Our support team is here to help. Send us a message and we'll get back to you as soon as possible.
                    </p>
                    <a href="mailto:support@ulendo-institute.com" className="btn btn-primary">
                        Contact Support
                    </a>
                </div>
            </section>
        </Layout>
    );
}
