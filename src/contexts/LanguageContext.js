import React, { createContext, useState, useContext, useEffect } from 'react';
import { getTranslation } from '../i18n';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    // Load saved language preference or default to English
    return localStorage.getItem('uiLanguage') || 'en';
  });

  useEffect(() => {
    // Save language preference
    localStorage.setItem('uiLanguage', currentLanguage);
  }, [currentLanguage]);

  const t = (key) => getTranslation(currentLanguage, key);

  const changeLanguage = (lang) => {
    setCurrentLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};


