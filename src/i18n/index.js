import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ar from '../locales/ar.json';
import en from '../locales/en.json';
import es from '../locales/es.json';
import de from '../locales/de.json';
import fr from '../locales/fr.json';
import zh from '../locales/zh.json';
import ru from '../locales/ru.json';

const resources = {
  ar: { translation: ar },
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  fr: { translation: fr },
  zh: { translation: zh },
  ru: { translation: { ...en, ...ru } },
};

i18n.use(initReactI18next).init({
  resources,

  lng: localStorage.getItem('language') || 'en',

  fallbackLng: 'en',

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
