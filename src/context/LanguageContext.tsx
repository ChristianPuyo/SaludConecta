import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t, type Language, type Translations, LANGUAGES } from '../i18n';

const LANG_STORAGE_KEY = '@saludconecta/language';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: keyof Translations, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es');

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(LANG_STORAGE_KEY);
        if (stored && (stored === 'es' || stored === 'shp' || stored === 'ash')) {
          setLanguageState(stored);
        }
      } catch {}
    })();
  }, []);

  const setLanguage = async (lang: Language) => {
    await AsyncStorage.setItem(LANG_STORAGE_KEY, lang);
    setLanguageState(lang);
  };

  const translate = (key: keyof Translations, params?: Record<string, string>) => t(language, key, params);

  const value = useMemo(() => ({ language, setLanguage, t: translate }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
