import React, { useState, useEffect, useRef } from 'react';
import './NewWordsPage.css';
import LanguageSelector from './LanguageSelector';
import WordEntry from './WordEntry';
import { useLanguage } from '../contexts/LanguageContext';

function NewWordsPage({ languages, onAddLanguage, onAddWord, onBack }) {
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [pendingLanguageName, setPendingLanguageName] = useState(null);
  const selectedLanguageIdRef = useRef(null);
  const { t } = useLanguage();

  useEffect(() => {
    // When a new language is added, find and select it
    if (pendingLanguageName) {
      const newLang = languages.find(l => l.name === pendingLanguageName);
      if (newLang) {
        setSelectedLanguage(newLang);
        selectedLanguageIdRef.current = newLang.id;
        setPendingLanguageName(null);
      }
    }
  }, [languages, pendingLanguageName]);

  useEffect(() => {
    // Keep selectedLanguage in sync with languages prop (for word updates)
    if (selectedLanguageIdRef.current) {
      const updatedLang = languages.find(l => l.id === selectedLanguageIdRef.current);
      if (updatedLang) {
        setSelectedLanguage(updatedLang);
      }
    }
  }, [languages]);

  const handleLanguageSelect = async (language) => {
    try {
      await onAddLanguage(language);
      setShowLanguageSelector(false);
      setPendingLanguageName(language);
    } catch (err) {
      // Error is handled in App.js
      setShowLanguageSelector(false);
    }
  };

  const handleLanguageClick = (language) => {
    setSelectedLanguage(language);
    selectedLanguageIdRef.current = language.id;
    setShowLanguageSelector(false);
  };

  return (
    <div className="new-words-page">
      <div className="new-words-container">
        <button className="back-button" onClick={onBack}>
          ← {t('back')}
        </button>
        <h1 className="page-title">{t('newWordsTitle')}</h1>
        
        {!selectedLanguage && !showLanguageSelector && (
          <div className="language-selection-area">
            <button 
              className="new-language-button"
              onClick={() => setShowLanguageSelector(true)}
            >
              + {t('newLanguage')}
            </button>
            
            {languages.length > 0 && (
              <div className="existing-languages">
                <h2 className="section-title">{t('yourLanguages')}</h2>
                <div className="language-list">
                  {languages.map(lang => {
                    const wordCount = lang.words ? lang.words.length : lang.word_count || 0;
                    return (
                      <button
                        key={lang.id}
                        className="language-card"
                        onClick={() => handleLanguageClick(lang)}
                      >
                        <span className="language-name">{lang.name}</span>
                        <span className="word-count">
                          {wordCount} {wordCount === 1 ? t('word') : t('words')}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {showLanguageSelector && (
          <LanguageSelector
            onSelect={handleLanguageSelect}
            onCancel={() => setShowLanguageSelector(false)}
            existingLanguages={languages.map(l => l.name)}
          />
        )}

        {selectedLanguage && !showLanguageSelector && (
          <WordEntry
            language={selectedLanguage}
            onAddWord={(word, translation) => {
              onAddWord(selectedLanguage.id, word, translation);
            }}
            onBack={() => setSelectedLanguage(null)}
          />
        )}
      </div>
    </div>
  );
}

export default NewWordsPage;

