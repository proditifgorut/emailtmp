import React, { useState } from 'react';
import { Copy, RefreshCw, Trash2, Volume2, VolumeX, Check, Loader2 } from 'lucide-react';
import { useEmail } from '../context/EmailContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

const EmailGenerator: React.FC = () => {
  const { email, generateNewEmail, refreshInbox, playSound, toggleSound, isGenerating, isRefreshing } = useEmail();
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (isGenerating || !email) return;
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100"
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('home.yourEmail')}
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={isGenerating ? 'Generating...' : email}
                readOnly
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleCopy}
              disabled={isGenerating || !email}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg disabled:bg-blue-400 disabled:cursor-not-allowed"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              <span className="font-medium">{copied ? t('home.copied') : t('home.copy')}</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
           <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isGenerating ? 'bg-yellow-500' : 'bg-green-500'} animate-pulse`}></div>
            <span className="text-sm font-medium text-gray-700">
              {isGenerating ? 'Waiting for new address...' : 'Ready to receive emails'}
            </span>
          </div>
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
            title={playSound ? t('home.soundOn') : t('home.soundOff')}
          >
            {playSound ? (
              <Volume2 className="w-5 h-5 text-blue-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={refreshInbox}
            disabled={isRefreshing || isGenerating}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
            <span className="font-medium">{t('home.refresh')}</span>
          </button>
          <button
            onClick={generateNewEmail}
            disabled={isGenerating}
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg hover:border-red-500 hover:text-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
            <span className="font-medium">{t('home.newEmail')}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EmailGenerator;
