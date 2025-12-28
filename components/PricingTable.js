import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../lib/AuthContext';
import CheckoutModal from './CheckoutModal';

export default function PricingTable({ plans = [], userSubscription }) {
    const { user } = useAuth();
    const router = useRouter();
    const [error, setError] = useState(null);
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);

    const formatPrice = (cents) => {
        return (cents / 100).toFixed(2);
    };

    const getMonthlyEquivalent = (plan) => {
        if (plan.interval === 'YEAR') {
            return (plan.priceCents / 12 / 100).toFixed(2);
        }
        return null;
    };

    const handleSubscribe = (plan) => {
        if (!user) {
            router.push('/login?redirect=/pricing');
            return;
        }
        setSelectedPlan(plan);
        setShowCheckoutModal(true);
    };

    if (!plans || plans.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600">No plans available at this time.</p>
            </div>
        );
    }

    return (
        <>
            <CheckoutModal
                isOpen={showCheckoutModal}
                onClose={() => setShowCheckoutModal(false)}
                plan={selectedPlan}
                user={user}
            />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg text-center mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {plans.map((plan) => {
                    const monthlyEquiv = getMonthlyEquivalent(plan);
                    const features = plan.features?.includes || [];
                    const isCurrentPlan = userSubscription?.planId === plan.id;

                    return (
                        <div
                            key={plan.id}
                            className={`card border-2 ${plan.interval === 'YEAR'
                                ? 'border-accent-500 relative'
                                : 'border-gray-200'
                                } transition-smooth hover:scale-105`}
                        >
                            {plan.interval === 'YEAR' && (
                                <div className="absolute top-0 right-0 bg-accent-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                                    BEST VALUE
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-2xl font-display font-bold mb-2">{plan.name}</h3>

                            {/* Price */}
                            <div className="mb-6">
                                <div className="flex items-baseline">
                                    <span className="text-5xl font-black text-gray-900">
                                        ${formatPrice(plan.priceCents)}
                                    </span>
                                    <span className="text-gray-600 ml-2">
                                        / {plan.interval.toLowerCase()}
                                    </span>
                                </div>
                                {monthlyEquiv && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Just ${monthlyEquiv}/month
                                    </p>
                                )}
                            </div>

                            {/* Features */}
                            <ul className="space-y-3 mb-8">
                                {features.map((feature, index) => (
                                    <li key={index} className="flex items-start">
                                        <svg
                                            className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA Button */}
                            {isCurrentPlan ? (
                                <div className="btn w-full bg-green-100 text-green-700 cursor-default">
                                    ✓ Current Plan
                                </div>
                            ) : userSubscription ? (
                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    className={`btn w-full ${plan.interval === 'YEAR' ? 'btn-accent' : 'btn-primary'}`}
                                >
                                    Switch Plan
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleSubscribe(plan)}
                                    className={`btn w-full ${plan.interval === 'YEAR' ? 'btn-accent' : 'btn-primary'}`}
                                >
                                    Get Started
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}

