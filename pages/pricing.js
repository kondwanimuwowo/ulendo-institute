import Layout from '../components/Layout';
import PricingTable from '../components/PricingTable';
import prisma from '../lib/prisma';
import { getAuthToken, verifyToken } from '../lib/auth';
import { getActiveSubscription } from '../lib/subscription';

export default function Pricing({ plans, userSubscription }) {
    return (
        <Layout>
            {/* Header */}
            <section className="section-padding bg-primary-950">
                <div className="container-custom text-center">
                    <h1 className="text-4xl md:text-6xl font-display font-black text-white mb-6">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-primary-50 max-w-3xl mx-auto">
                        Get unlimited access to all courses and start your transformation today
                    </p>
                </div>
            </section>

            {/* Pricing Table */}
            <section className="section-padding bg-white -mt-16">
                <div className="container-custom">
                    <PricingTable plans={plans} userSubscription={userSubscription} />
                </div>
            </section>

            {/* FAQ */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom max-w-4xl">
                    <h2 className="text-3xl font-display font-black text-center mb-12">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-6">
                        <details className="card">
                            <summary className="font-semibold text-lg cursor-pointer">
                                Can I cancel anytime?
                            </summary>
                            <p className="text-gray-600 mt-3">
                                Yes! You can cancel your subscription at any time. If you cancel, you'll continue to have access until the end of your current billing period.
                            </p>
                        </details>

                        <details className="card">
                            <summary className="font-semibold text-lg cursor-pointer">
                                Do I get access to all courses?
                            </summary>
                            <p className="text-gray-600 mt-3">
                                Absolutely! Both monthly and annual plans give you unlimited access to all published courses on the platform, plus any new courses that are added.
                            </p>
                        </details>

                        <details className="card">
                            <summary className="font-semibold text-lg cursor-pointer">
                                Is there a money-back guarantee?
                            </summary>
                            <p className="text-gray-600 mt-3">
                                We offer a 30-day money-back guarantee. If you're not satisfied with the courses, contact us within 30 days for a full refund.
                            </p>
                        </details>

                        <details className="card">
                            <summary className="font-semibold text-lg cursor-pointer">
                                Are the courses self-paced?
                            </summary>
                            <p className="text-gray-600 mt-3">
                                Yes! All courses are self-paced, so you can learn on your own schedule. Access to courses is unlimited as long as your subscription is active.
                            </p>
                        </details>

                        <details className="card">
                            <summary className="font-semibold text-lg cursor-pointer">
                                Do I get a certificate?
                            </summary>
                            <p className="text-gray-600 mt-3">
                                Yes! Upon completing a course, you'll receive a certificate of completion that you can share on LinkedIn and your resume.
                            </p>
                        </details>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="section-padding bg-primary-900">
                <div className="container-custom text-center">
                    <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4">
                        Still Have Questions?
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        Contact our support team and we'll be happy to help
                    </p>
                    <a href="mailto:support@ulendo-institute.com" className="btn bg-white text-primary-950 hover:bg-gray-100">
                        Get in Touch
                    </a>
                </div>
            </section>
        </Layout>
    );
}

export async function getServerSideProps({ req }) {
    try {
        // Check user subscription status
        let userSubscription = null;
        const token = getAuthToken(req);
        if (token) {
            const decoded = verifyToken(token);
            if (decoded?.userId) {
                const subscription = await getActiveSubscription(decoded.userId);
                if (subscription) {
                    userSubscription = JSON.parse(JSON.stringify(subscription));
                }
            }
        }

        const plans = await prisma.plan.findMany({
            where: { isActive: true },
            orderBy: { priceCents: 'asc' },
        });

        return {
            props: {
                plans: JSON.parse(JSON.stringify(plans)),
                userSubscription,
            },
        };
    } catch (error) {
        console.error('Error fetching plans:', error);
        return {
            props: {
                plans: [],
                userSubscription: null,
            },
        };
    }
}
