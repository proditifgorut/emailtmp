import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useLanguage } from './LanguageContext';

// --- TYPES FOR 1SECMail API ---
interface Attachment {
  filename: string;
  contentType: string;
  size: number;
}

export interface EmailSummary {
  id: number;
  from: string;
  subject: string;
  date: string;
}

export interface EmailDetail extends EmailSummary {
  attachments: Attachment[];
  body: string;
  textBody: string;
}

export type Email = Partial<EmailDetail> & EmailSummary & { read: boolean };

interface EmailContextType {
  email: string;
  emails: Email[];
  isGenerating: boolean;
  isRefreshing: boolean;
  isLoadingEmail: boolean;
  generateNewEmail: () => void;
  refreshInbox: () => void;
  fetchEmailDetails: (id: number) => Promise<void>;
  deleteEmail: (id: number) => void;
  playSound: boolean;
  toggleSound: () => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

const API_URL = 'https://www.1secmail.com/api/v1/';

// Helper function to route requests through a CORS proxy to prevent browser-side blocking issues.
const fetchViaProxy = async (url: string) => {
  // Using a different proxy that directly forwards the API response.
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`API fetch failed with status: ${response.status} ${response.statusText}`);
  }
  // This proxy returns the direct JSON response from the API.
  return response.json();
};

export const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [email, setEmail] = useState<string>('');
  const [emails, setEmails] = useState<Email[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState<boolean>(false);
  const [playSound, setPlaySound] = useState<boolean>(false);
  const { t } = useLanguage();

  const generateNewEmail = useCallback(async () => {
    setIsGenerating(true);
    setEmails([]);
    try {
      const data = await fetchViaProxy(`${API_URL}?action=genRandomMailbox&count=1`);
      if (data && data.length > 0) {
        const newAddress = data[0];
        setEmail(newAddress);

        // Create and add a welcome email
        const welcomeEmail: Email = {
          id: Date.now(),
          from: 'welcome@alpha.dualite.dev',
          subject: t('home.welcomeSubject'),
          date: new Date().toISOString(),
          body: t('home.welcomeBody'),
          read: false,
          attachments: [],
          textBody: 'Welcome to TempMail! Your new temporary email address is active and ready to receive emails.',
        };
        setEmails([welcomeEmail]);
      }
    } catch (error) {
      console.error('Failed to generate new email:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [t]);

  const refreshInbox = useCallback(async () => {
    if (!email || isRefreshing) return;

    setIsRefreshing(true);
    const [login, domain] = email.split('@');
    try {
      const data: EmailSummary[] = await fetchViaProxy(`${API_URL}?action=getMessages&login=${login}&domain=${domain}`);
      
      setEmails(prevEmails => {
        const existingApiEmails = prevEmails.filter(e => e.from !== 'welcome@alpha.dualite.dev');
        const welcomeEmail = prevEmails.find(e => e.from === 'welcome@alpha.dualite.dev');

        const newApiEmails = data.filter(newEmail => !existingApiEmails.some(oldEmail => oldEmail.id === newEmail.id));
        
        if (newApiEmails.length > 0 && playSound) {
          const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBjiR1/LMeSwFJHfH8N2QQAo=');
          audio.play().catch(() => {});
        }
        
        const updatedApiEmails = data.map(newEmail => {
            const existing = existingApiEmails.find(e => e.id === newEmail.id);
            return existing ? existing : { ...newEmail, read: false };
        });

        return welcomeEmail ? [welcomeEmail, ...updatedApiEmails] : updatedApiEmails;
      });

    } catch (error) {
      console.error('Failed to refresh inbox:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [email, isRefreshing, playSound]);

  const fetchEmailDetails = async (id: number) => {
    if (!email || id <= 0) return; // Do not fetch for mock email
    setIsLoadingEmail(true);
    const [login, domain] = email.split('@');
    try {
      const data: EmailDetail = await fetchViaProxy(`${API_URL}?action=readMessage&login=${login}&domain=${domain}&id=${id}`);
      setEmails(prev =>
        prev.map(e => (e.id === id ? { ...e, ...data, read: true } : e))
      );
    } catch (error) {
      console.error('Failed to fetch email details:', error);
    } finally {
      setIsLoadingEmail(false);
    }
  };

  const deleteEmail = (id: number) => {
    setEmails(prev => prev.filter(e => e.id !== id));
  };

  const toggleSound = () => {
    setPlaySound(prev => !prev);
  };

  useEffect(() => {
    generateNewEmail();
  }, [generateNewEmail]);

  useEffect(() => {
    if (!email || isGenerating) return;
    const interval = setInterval(refreshInbox, 10000);
    return () => clearInterval(interval);
  }, [email, isGenerating, refreshInbox]);

  return (
    <EmailContext.Provider
      value={{
        email,
        emails,
        isGenerating,
        isRefreshing,
        isLoadingEmail,
        generateNewEmail,
        refreshInbox,
        fetchEmailDetails,
        deleteEmail,
        playSound,
        toggleSound,
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (!context) {
    throw new Error('useEmail must be used within EmailProvider');
  }
  return context;
};
