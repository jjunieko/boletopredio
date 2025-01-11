import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en';
import pt from './locales/pt';
import es from './locales/es';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en,
      pt,
      es,
    },
    fallbackLng: 'pt',
    lng: 'pt',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
  });

if (!localStorage.getItem('i18nextLng')) {
  i18n.changeLanguage('pt');
}

export default i18n; 