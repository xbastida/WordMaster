import React from 'react';
import './PracticePage.css';
import { useLanguage } from '../contexts/LanguageContext';

function PracticePage({ languages, onBack }) {
  const { t } = useLanguage();
  
  return (
    <div className="practice-page">
      <div className="practice-container">
        <button className="back-button" onClick={onBack}>
          ← {t('back')}
        </button>
        <h1 className="page-title">{t('practiceTitle')}</h1>
        <div className="practice-content">
          <p className="coming-soon">{t('comingSoon')}</p>
          {languages.length === 0 && (
            <p className="no-languages-hint">
              {t('noLanguagesHint')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PracticePage;


