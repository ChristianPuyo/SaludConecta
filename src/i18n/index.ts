import es from './locales/es';
import shp from './locales/shp';
import ash from './locales/ash';

export type Language = 'es' | 'shp' | 'ash';

export const LANGUAGES: { id: Language; name: string; nativeName: string }[] = [
  { id: 'es', name: 'Español', nativeName: 'Español' },
  { id: 'shp', name: 'Shipibo-Konibo', nativeName: 'Shipibo-Konibo' },
  { id: 'ash', name: 'Asháninka', nativeName: 'Asháninka' },
];

export type Translations = typeof es;

const translations: Record<Language, Translations> = { es, shp, ash };

export function t(lang: Language, key: keyof Translations, params?: Record<string, string>): string {
  let value = translations[lang][key] || translations['es'][key];
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      value = value.replace(`{${k}}`, v);
    });
  }
  return value;
}
