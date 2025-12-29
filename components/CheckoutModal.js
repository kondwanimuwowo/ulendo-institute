import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, Check, DollarSign, FileText, CreditCard, CheckCircle } from 'lucide-react';

export default function CheckoutModal({ isOpen, onClose, plan, user }) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        paymentMethod: 'mobile-money',
        operator: 'airtel'
    });

    const steps = [
        { number: 1, label: 'Plan', Icon: DollarSign },
        { number: 2, label: 'Details', Icon: FileText },
        { number: 3, label: 'Review', Icon: Check },
        { number: 4, label: 'Payment', Icon: CreditCard },
        { number: 5, label: 'Complete', Icon: CheckCircle }
    ];

    const formatPrice = (cents) => (cents / 100).toFixed(2);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const validateStep2 = () => {
        if (!formData.name) return 'Please enter your full name';
        if (!formData.email) return 'Please enter your email';
        if (formData.paymentMethod === 'mobile-money' && !formData.phone) {
            return 'Please enter your mobile money number';
        }
        return null;
    };

    const handleContinue = () => {
        if (step === 2) {
            const validationError = validateStep2();
            if (validationError) {
                setError(validationError);
                return;
            }
        }
        setError('');
        setStep(step + 1);
    };

    const handleBack = () => {
        setError('');
        setStep(step - 1);
    };

    const handlePayment = async () => {
        setLoading(true);
        setError('');
        setStep(4);

        try {
            const res = await fetch('/api/payments/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    planId: plan.id,
                    phone: formData.phone,
                    paymentMethod: formData.paymentMethod,
                    operator: formData.operator
                })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Payment failed');
            }

            setStep(5);
        } catch (err) {
            setError(err.message);
            setStep(3);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setStep(1);
        setError('');
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: '',
            paymentMethod: 'mobile-money',
            operator: 'airtel'
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-xl"
            >
                {/* Header with Progress */}
                <div className="bg-white border-b border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-display font-bold">Subscribe to {plan?.name}</h2>
                        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Progress Indicator */}
                    <div className="flex items-center justify-between max-w-xl mx-auto">
                        {steps.map((s, idx) => (
                            <div key={s.number} className="flex items-center flex-1">
                                <div className="flex flex-col items-center">
                                    <motion.div
                                        animate={{ scale: step >= s.number ? 1 : 0.95 }}
                                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${step >= s.number
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >
                                        {step > s.number ? <Check className="w-5 h-5" /> : <s.Icon className="w-5 h-5" />}
                                    </motion.div>
                                    <span className={`text-xs mt-1 hidden sm:block ${step >= s.number ? 'text-primary-600' : 'text-gray-400'}`}>
                                        {s.label}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="flex-1 h-0.5 mx-2 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: '0%' }}
                                            animate={{ width: step > s.number ? '100%' : '0%' }}
                                            className="h-full bg-primary-600"
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Plan Confirmation */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl p-6 mb-6">
                                    <h3 className="text-lg font-semibold mb-2">Selected Plan</h3>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm font-bold text-gray-500">ZMW</span>
                                        <span className="text-4xl font-black text-gray-900">{formatPrice(plan?.priceCents)}</span>
                                        <span className="text-gray-600">/ {plan?.interval.toLowerCase()}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{plan?.name}</p>
                                </div>

                                <div className="space-y-3">
                                    <h4 className="font-semibold">What's included:</h4>
                                    {(plan?.features?.features || plan?.features?.includes)?.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={handleContinue} className="btn btn-primary w-full mt-8">
                                    Continue to Details
                                </button>
                            </motion.div>
                        )}

                        {/* Step 2: Details Form */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <button onClick={handleBack} className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to plan
                                </button>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="input w-full"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input w-full"
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, paymentMethod: 'mobile-money' })}
                                                className={`p-4 border-2 rounded-lg transition-all ${formData.paymentMethod === 'mobile-money'
                                                    ? 'border-primary-600 bg-primary-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="font-semibold">Mobile Money</div>
                                                <div className="text-xs text-gray-600">Airtel, MTN, Zamtel</div>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, paymentMethod: 'card' })}
                                                className={`p-4 border-2 rounded-lg transition-all ${formData.paymentMethod === 'card'
                                                    ? 'border-primary-600 bg-primary-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="font-semibold">Card</div>
                                                <div className="text-xs text-gray-600">Visa, Mastercard</div>
                                            </button>
                                        </div>
                                    </div>

                                    {formData.paymentMethod === 'mobile-money' && (
                                        <>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Money Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="input w-full"
                                                    placeholder="0977123456"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Operator</label>
                                                <select
                                                    name="operator"
                                                    value={formData.operator}
                                                    onChange={handleInputChange}
                                                    className="input w-full"
                                                >
                                                    <option value="airtel">Airtel</option>
                                                    <option value="mtn">MTN</option>
                                                    <option value="zamtel">Zamtel</option>
                                                </select>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <button onClick={handleContinue} className="btn btn-primary w-full mt-6">
                                    Continue to Review
                                </button>
                            </motion.div>
                        )}

                        {/* Step 3: Review */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <button onClick={handleBack} className="flex items-center text-primary-600 hover:text-primary-700 mb-6">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to details
                                </button>

                                <h3 className="text-xl font-bold mb-6">Review Your Subscription</h3>

                                <div className="space-y-4">
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">Plan</div>
                                        <div className="font-semibold">{plan?.name} - ZMW {formatPrice(plan?.priceCents)}/{plan?.interval.toLowerCase()}</div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">Name</div>
                                        <div className="font-semibold">{formData.name}</div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">Email</div>
                                        <div className="font-semibold">{formData.email}</div>
                                    </div>

                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 mb-1">Payment Method</div>
                                        <div className="font-semibold capitalize">
                                            {formData.paymentMethod === 'mobile-money'
                                                ? `Mobile Money (${formData.operator.toUpperCase()}) - ${formData.phone}`
                                                : 'Card Payment'
                                            }
                                        </div>
                                    </div>
                                </div>

                                {error && (
                                    <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <button onClick={handlePayment} disabled={loading} className="btn btn-primary w-full mt-6">
                                    Confirm & Pay
                                </button>
                            </motion.div>
                        )}

                        {/* Step 4: Processing */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                                <h3 className="text-xl font-bold mb-2">Processing Payment...</h3>
                                <p className="text-gray-600">
                                    {formData.paymentMethod === 'mobile-money'
                                        ? 'Check your phone for the payment prompt'
                                        : 'Please wait while we process your payment'
                                    }
                                </p>
                            </motion.div>
                        )}

                        {/* Step 5: Success */}
                        {step === 5 && (
                            <motion.div
                                key="step5"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-12"
                            >
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-10 h-10 text-green-600" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">Payment Initiated!</h3>
                                <p className="text-gray-600 mb-6">
                                    {formData.paymentMethod === 'mobile-money'
                                        ? 'Check your phone to approve the payment. Your subscription will be activated once payment is confirmed.'
                                        : 'Your payment is being processed. You will receive a confirmation email shortly.'
                                    }
                                </p>
                                <button onClick={() => window.location.href = '/dashboard'} className="btn btn-primary">
                                    Go to Dashboard
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}
