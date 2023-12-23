import i18next from 'i18next';
import enMain from './locales/en/main.json';
import zhMain from './locales/zh/main.json';
import { initReactI18next } from 'react-i18next';

export const defaultNS = 'main';

i18next.use(initReactI18next).init({
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

});

export default i18next;