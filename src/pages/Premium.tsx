import React, { useState } from 'react';
import { Check, Crown, Zap } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const Premium: React.FC = () => {
  const { t } = useLanguage();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const features = [
    { icon: Check, text: t('premium.feature1'), description: t('premium.feature1Desc') },
    { icon: Check, text: t('premium.feature2'), description: t('premium.feature2Desc') },
    { icon: Check, text: t('premium.feature3'), description: t('premium.feature3Desc') },
    { icon: Check, text: t('premium.feature4'), description: t('premium.feature4Desc') },
    { icon: Check, text: t('premium.feature5'), description: t('premium.feature5Desc') },
    { icon: Check, text: t('premium.feature6'), description: t('premium.feature6Desc') },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl mb-4"
          >
            <Crown className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('premium.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('premium.subtitle')}
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-xl p-1 shadow-md inline-flex">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('premium.monthly')}
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {t('premium.yearly')}
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                {t('premium.save20')}
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free Plan</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">{t('premium.perMonth')}</span>
              </div>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">30 minutes email duration</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">1 email address at a time</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Basic support</span>
              </li>
            </ul>
            <button className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
              Current Plan
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 rounded-bl-lg font-semibold text-sm">
              POPULAR
            </div>
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-2">Premium Plan</h3>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold">
                  ${billingCycle === 'monthly' ? '9.99' : '7.99'}
                </span>
                <span className="ml-2">{t('premium.perMonth')}</span>
              </div>
              {billingCycle === 'yearly' && (
                <p className="text-blue-200 text-sm mt-1">Billed annually at $95.88</p>
              )}
            </div>
            <ul className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <feature.icon className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">{feature.text}</p>
                    <p className="text-blue-200 text-sm">{feature.description}</p>
                  </div>
                </li>
              ))}
            </ul>
            <button className="w-full py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>{t('premium.choosePlan')}</span>
            </button>
            <p className="text-center text-blue-200 text-sm mt-4">{t('premium.comingSoon')}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
