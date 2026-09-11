import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import zh from './locales/zh.json';
import en from './locales/en.json';

i18n.use(initReactI18next).init({
  resources: {
    zh: { translation: zh },
    en: { translation: en }
  },
  lng: 'zh',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  // use the English text itself as the key; missing zh entries fall back to en,
  // and missing en entries fall back to the key (the original English text)
  saveMissing: false
});

export default i18n;
