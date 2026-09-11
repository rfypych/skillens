'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import en from './locales/en.json';
import id from './locales/id.json';

type Language = 'en' | 'id';
type Dictionary = Record<string, any>;

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const dictionaries: Record<Language, Dictionary> = { en, id };

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('id');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('app_lang') as Language | null;
    if (saved && (saved === 'en' || saved === 'id')) {
      setLanguageState(saved);
      setIsLoaded(true);
      return;
    }

    // Attempt to detect via IP, fallback to 'id'
    const detectLocation = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data && data.country_code === 'ID') {
          setLanguageState('id');
          localStorage.setItem('app_lang', 'id');
        } else {
          setLanguageState('en');
          localStorage.setItem('app_lang', 'en');
        }
      } catch {
        setLanguageState('id');
        localStorage.setItem('app_lang', 'id');
      } finally {
        setIsLoaded(true);
      }
    };

    detectLocation();
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value = dictionaries[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key; // Fallback to the key itself if not found
      }
    }
    return typeof value === 'string' ? value : key;
  };

  // Prevent hydration mismatch by not rendering until we know the language
  if (!isLoaded) {
    return null;
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
