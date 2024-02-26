import i18next from 'i18next';
import enMain from './locales/en/main.json';
import zhMain from './locales/zh/main.json';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';


export const defaultNS = 'main';
const DETECTION_OPTIONS = {
  order: ['localStorage', 'navigator'],
  caches: ['localStorage']
};

i18next.use(LanguageDetector).use(initReactI18next).init({
  debug: true,
  fallbackLng: 'en',
  defaultNS,
  resources: {
    en: {
      main: enMain,
    },
    zh: {
      main: zhMain,
    },
  },
  initImmediate: false,
  detection: DETECTION_OPTIONS,


});

export default i18next;