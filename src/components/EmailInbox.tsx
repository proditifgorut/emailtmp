import React, { useState } from 'react';
import { Mail, Trash2, Clock, ArrowLeft, Loader2, Paperclip, Download } from 'lucide-react';
import { useEmail } from '../context/EmailContext';
import { useLanguage } from '../context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';

const EmailInbox: React.FC = () => {
  const { email, emails, fetchEmailDetails, deleteEmail, isLoadingEmail } = useEmail();
  const { t } = useLanguage();
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  const handleEmailClick = (id: number) => {
    setSelectedEmailId(id);
    const targetEmail = emails.find(e => e.id === id);
    if (!targetEmail?.body) {
      fetchEmailDetails(id);
    }
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteEmail(id);
    if (selectedEmailId === id) {
      setSelectedEmailId(null);
    }
  };

  const getAttachmentDownloadUrl = (messageId: number, filename: string) => {
    if (!email) return '#';
    const [login, domain] = email.split('@');
    return `https://www.1secmail.com/api/v1/?action=download&login=${login}&domain=${domain}&id=${messageId}&file=${filename}`;
  };

  const selectedEmailData = emails.find((e) => e.id === selectedEmailId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
    >
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h2 className="text-xl font-bold text-white flex items-center space-x-2">
          <Mail className="w-6 h-6" />
          <span>{t('home.inbox')}</span>
          <span className="bg-white text-blue-600 text-sm px-2 py-1 rounded-full">
            {emails.length}
          </span>
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {selectedEmailData ? (
          <motion.div
            key="email-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6"
          >
            <button
              onClick={() => setSelectedEmailId(null)}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-4 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>{t('home.backToInbox')}</span>
            </button>

            {isLoadingEmail && !selectedEmailData.body ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <span className="ml-4 text-gray-600">{t('home.loadingEmail')}</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {selectedEmailData.subject}
                  </h3>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium truncate">{selectedEmailData.from}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(selectedEmailData.date)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(selectedEmailData.id, e)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title={t('home.deleteEmail')}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {selectedEmailData.attachments && selectedEmailData.attachments.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center"><Paperclip className="w-4 h-4 mr-2"/>{t('home.attachments')}</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedEmailData.attachments.map(att => (
                        <a
                          key={att.filename}
                          href={getAttachmentDownloadUrl(selectedEmailData.id, att.filename)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          <span>{att.filename} ({(att.size / 1024).toFixed(1)} KB)</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedEmailData.body || '' }} />
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="email-list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {emails.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="bg-blue-50 p-6 rounded-full mb-4">
                  <Mail className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {t('home.noEmails')}
                </h3>
                <p className="text-gray-600 text-center max-w-md">
                  {t('home.noEmailsDesc')}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {emails.map((email, index) => (
                  <motion.div
                    key={email.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleEmailClick(email.id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !email.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              email.read ? 'bg-gray-300' : 'bg-blue-600'
                            }`}
                          ></div>
                          <p
                            className={`text-sm truncate ${
                              email.read ? 'text-gray-600' : 'text-gray-900 font-semibold'
                            }`}
                          >
                            {email.from}
                          </p>
                        </div>
                        <h4
                          className={`text-sm mb-1 truncate ${
                            email.read ? 'text-gray-700' : 'text-gray-900 font-semibold'
                          }`}
                        >
                          {email.subject}
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2 ml-4 flex-shrink-0">
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(email.date)}</span>
                        </div>
                        <button
                          onClick={(e) => handleDelete(email.id, e)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title={t('home.deleteEmail')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EmailInbox;
