import { createContext, useContext, useEffect, useState } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(
    localStorage.getItem('language') || 'en'
  );

  const setLanguage = (newLanguage) => {
    setLanguageState(newLanguage);

    localStorage.setItem('language', newLanguage);

    i18n.changeLanguage(newLanguage);

    document.documentElement.lang = newLanguage;

    document.documentElement.dir =
      newLanguage === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    setLanguage(language);
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}