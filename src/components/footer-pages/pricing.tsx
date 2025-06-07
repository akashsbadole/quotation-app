import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

interface PricingProps {
  onNavigate?: (section: string) => void;
}

export const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Starter',
      description: 'Perfect for small businesses getting started',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Up to 50 quotations per month',
        '5 team members',
        'Basic templates',
        'Email support',
        'PDF export',
        'Basic analytics',
        'Mobile access'
      ],
      popular: false,
      color: 'blue'
    },
    {
      name: 'Professional',
      description: 'Ideal for growing businesses',
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        'Unlimited quotations',
        '25 team members',
        'Advanced templates',
        'Priority support',
        'Custom branding',
        'Advanced analytics',
        'Workflow automation',
        'API access',
        'Integrations'
      ],
      popular: true,
      color: 'indigo'
    },
    {
      name: 'Enterprise',
      description: 'For large organizations with advanced needs',
      monthlyPrice: 199,
      yearlyPrice: 1990,
      features: [
        'Unlimited everything',
        'Unlimited team members',
        'Custom templates',
        'Dedicated support',
        'White-label solution',
        'Advanced security',
        'Custom integrations',
        'SLA guarantee',
        'Training & onboarding'
      ],
      popular: false,
      color: 'purple'
    }
  ];

  const addOns = [
    {
      name: 'Advanced Security',
      description: 'Enhanced security features including SSO and advanced encryption',
      price: 25,
      icon: 'lucide:shield'
    },
    {
      name: 'Custom Integrations',
      description: 'Build custom integrations with our API and webhook support',
      price: 50,
      icon: 'lucide:plug'
    },
    {
      name: 'Premium Support',
      description: '24/7 phone support with dedicated account manager',
      price: 100,
      icon: 'lucide:headphones'
    }
  ];

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const getSavings = (plan: typeof plans[0]) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const yearlyCost = plan.yearlyPrice;
    return monthlyCost - yearlyCost;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <motion.button
                className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onNavigate?.('dashboard')}
              >
                <Icon icon="lucide:arrow-left" className="text-xl" />
              </motion.button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Pricing</h1>
                <p className="text-sm text-gray-600">Choose the perfect plan for your business</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p
            className="text-xl text-blue-100 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            No hidden fees, no surprises. Choose a plan that scales with your business.
          </motion.p>

          {/* Billing Toggle */}
          <motion.div
            className="flex items-center justify-center space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <span className={`text-lg ${billingCycle === 'monthly' ? 'text-white' : 'text-blue-200'}`}>
              Monthly
            </span>
            <button
              className="relative w-16 h-8 bg-blue-500 rounded-full p-1 transition-colors duration-200"
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                  billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-lg ${billingCycle === 'yearly' ? 'text-white' : 'text-blue-200'}`}>
              Yearly
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Save up to 20%
              </span>
            )}
          </motion.div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`bg-white rounded-lg shadow-lg border-2 ${
                plan.popular ? 'border-indigo-500 relative' : 'border-gray-200'
              } p-8 hover:shadow-xl transition-shadow duration-200`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-indigo-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${getPrice(plan)}
                  </span>
                  <span className="text-gray-600">
                    /{billingCycle === 'monthly' ? 'month' : 'year'}
                  </span>
                </div>
                {billingCycle === 'yearly' && (
                  <p className="text-green-600 text-sm font-medium">
                    Save ${getSavings(plan)} per year
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Icon icon="lucide:check" className="text-green-500 mr-3" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${
                  plan.popular
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add-ons Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Add-ons & Extensions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enhance your QuoteManager experience with powerful add-ons designed for specific business needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {addOns.map((addon, index) => (
              <motion.div
                key={addon.name}
                className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon icon={addon.icon} className="text-2xl text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900">{addon.name}</h3>
                    <p className="text-2xl font-bold text-blue-600">${addon.price}/month</p>
                  </div>
                </div>
                <p className="text-gray-600">{addon.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
                <p className="text-gray-600">We offer a 14-day free trial for all plans. No credit card required to get started.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do you offer discounts for nonprofits?</h3>
                <p className="text-gray-600">Yes, we offer special pricing for qualified nonprofit organizations. Contact us for details.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                <p className="text-gray-600">Absolutely. We use enterprise-grade security and are SOC 2 Type II certified.</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-600">Yes, you can cancel your subscription at any time. No long-term contracts or cancellation fees.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Free Trial?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses that trust QuoteManager. Start your 14-day free trial today.
          </p>
          <motion.button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Free Trial
          </motion.button>
        </div>
      </div>
    </div>
  );
};
