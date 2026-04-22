import React from 'react';
import './LanguageSwitcher.css';
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSwitcher() {
  const { currentLanguage, changeLanguage } = useLanguage();

  return (
    <div className="language-switcher">
      <button
        className={`lang-button ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
        title="English"
      >
        EN
      </button>
      <button
        className={`lang-button ${currentLanguage === 'es' ? 'active' : ''}`}
        onClick={() => changeLanguage('es')}
        title="Español"
      >
        ES
      </button>
    </div>
  );
}

export default LanguageSwitcher;


