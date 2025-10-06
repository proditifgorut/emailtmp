import React from 'react';
import EmailGenerator from '../components/EmailGenerator';
import EmailInbox from '../components/EmailInbox';
import { useLanguage } from '../context/LanguageContext';
import { Shield, Zap, Lock } from 'lucide-react';

const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('home.title')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('home.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Privacy Protected</h3>
            <p className="text-sm text-gray-600">
              Keep your real email address private and secure from spam
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Setup</h3>
            <p className="text-sm text-gray-600">
              Get your temporary email instantly without any registration
            </p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Auto Delete</h3>
            <p className="text-sm text-gray-600">
              All emails are automatically deleted after expiration
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <EmailGenerator />
          <EmailInbox />
        </div>
      </div>
    </div>
  );
};

export default Home;
