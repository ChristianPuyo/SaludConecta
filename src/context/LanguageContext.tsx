/**
 * LanguageContext — Global i18n provider for SaludConecta
 *
 * Wraps the entire app and exposes:
 *   - lang: current language code ('es' | 'en' | 'shp')
 *   - t:    full typed translation object for the active language
 *   - setLanguage: persists the selection to AsyncStorage
 *
 * All translation strings live in: src/i18n/translations.ts
 * Add new strings there — this file only handles the context plumbing.
 */
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LANGUAGES, type AppTranslations, type LanguageType } from '../i18n/translations';

const LANG_STORAGE_KEY = '@saludconecta/active-language';

interface LanguageContextValue {
  lang: LanguageType;
  t: AppTranslations;
  setLanguage: (lang: LanguageType) => Promise<void>;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LanguageType>('es');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(LANG_STORAGE_KEY);
        if (stored === 'es' || stored === 'en' || stored === 'shp') {
          setLang(stored);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const setLanguage = async (newLang: LanguageType) => {
    await AsyncStorage.setItem(LANG_STORAGE_KEY, newLang);
    setLang(newLang);
  };

  // t is derived from LANGUAGES registry — reactively updates across the app
  const t = useMemo(() => LANGUAGES[lang], [lang]);

  const value = useMemo(
    () => ({ lang, t, setLanguage, isLoading }),
    [lang, t, isLoading]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Re-export types for convenience
export type { LanguageType, AppTranslations };
