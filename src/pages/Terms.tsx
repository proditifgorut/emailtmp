import React from 'react';
import { FileText } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Terms: React.FC = () => {
  const { t } = useLanguage();

  const sections = [
    { title: t('terms.section1Title'), content: t('terms.section1Content') },
    { title: t('terms.section2Title'), content: t('terms.section2Content') },
    { title: t('terms.section3Title'), content: t('terms.section3Content') },
    { title: t('terms.section4Title'), content: t('terms.section4Content') },
    { title: t('terms.section5Title'), content: t('terms.section5Content') },
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {t('terms.title')}
          </h1>
          <p className="text-sm text-gray-600">
            {t('terms.lastUpdated')}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <p className="text-gray-700 mb-8">{t('terms.intro')}</p>

          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{section.title}</h2>
                <p className="text-gray-700 leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;
