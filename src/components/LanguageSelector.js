import React, { useState, useMemo } from 'react';
import './LanguageSelector.css';
import { useLanguage } from '../contexts/LanguageContext';

const AVAILABLE_LANGUAGES = [
  'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese',
  'Russian', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Hindi',
  'Dutch', 'Swedish', 'Norwegian', 'Danish', 'Finnish', 'Polish',
  'Turkish', 'Greek', 'Hebrew', 'Thai', 'Vietnamese', 'Indonesian'
].sort();

function LanguageSelector({ onSelect, onCancel, existingLanguages }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const { t } = useLanguage();
  
  const availableLanguages = useMemo(() => {
    return AVAILABLE_LANGUAGES.filter(lang => !existingLanguages.includes(lang));
  }, [existingLanguages]);

  const filteredLanguages = useMemo(() => {
    if (!searchTerm) return availableLanguages;
    return availableLanguages.filter(lang =>
      lang.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, availableLanguages]);

  const handleConfirm = () => {
    if (selectedLanguage) {
      onSelect(selectedLanguage);
    }
  };

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
  };

  if (availableLanguages.length === 0) {
    return (
      <div className="language-selector">
        <p className="no-languages-message">
          {t('allLanguagesAdded')}
        </p>
        <button className="cancel-button" onClick={onCancel}>
          {t('back')}
        </button>
      </div>
    );
  }

  return (
    <div className="language-selector">
      <h2 className="selector-title">{t('selectLanguage')}</h2>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder={t('searchLanguage')}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
      </div>

      <div className="dropdown-container">
        {filteredLanguages.length > 0 ? (
          <div className="language-list-dropdown">
            {filteredLanguages.map((lang) => (
              <div
                key={lang}
                className={`language-item ${selectedLanguage === lang ? 'selected' : ''}`}
                onClick={() => handleLanguageClick(lang)}
              >
                {lang}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-results">
            {t('noLanguagesFound')}
          </div>
        )}
      </div>

      {selectedLanguage && (
        <div className="selected-display">
          {t('selected')}: <strong>{selectedLanguage}</strong>
        </div>
      )}

      <div className="button-group">
        <button 
          className="confirm-button" 
          onClick={handleConfirm}
          disabled={!selectedLanguage}
        >
          {t('confirm')}
        </button>
        <button className="cancel-button" onClick={onCancel}>
          {t('cancel')}
        </button>
      </div>
    </div>
  );
}

export default LanguageSelector;


