import React, { useState } from 'react';
import './WordEntry.css';
import { useLanguage } from '../contexts/LanguageContext';
import { lookupWord, formatDefinition, lookupWordFreeDictionary } from '../services/dictionaryService';

function WordEntry({ language, onAddWord, onBack }) {
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lookingUp, setLookingUp] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const { t } = useLanguage();

  const handleLookup = async () => {
    if (!word.trim()) {
      setLookupError(t('enterWordFirst'));
      return;
    }

    setLookingUp(true);
    setLookupError('');

    try {
      // Try API Ninjas first
      const data = await lookupWord(word.trim());
      const definition = formatDefinition(data);
      
      if (definition) {
        setTranslation(definition);
      } else {
        // Try Free Dictionary API as backup
        try {
          const freeDictDefinition = await lookupWordFreeDictionary(word.trim());
          setTranslation(freeDictDefinition);
        } catch (backupError) {
          setLookupError(t('noDefinitionFound'));
        }
      }
    } catch (error) {
      // Try Free Dictionary API as backup
      try {
        const freeDictDefinition = await lookupWordFreeDictionary(word.trim());
        setTranslation(freeDictDefinition);
        setLookupError('');
      } catch (backupError) {
        if (error.message.includes('API key')) {
          setLookupError(t('apiKeyMissing'));
        } else {
          setLookupError(t('lookupFailed'));
        }
      }
    } finally {
      setLookingUp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (word.trim() && translation.trim() && !submitting) {
      setSubmitting(true);
      try {
        await onAddWord(language.id, word.trim(), translation.trim());
        setWord('');
        setTranslation('');
        setLookupError('');
      } catch (err) {
        // Error is handled in App.js
      } finally {
        setSubmitting(false);
      }
    }
  };

  const wordCount = language.words ? language.words.length : language.word_count || 0;
  
  return (
    <div className="word-entry">
      <div className="word-entry-header">
        <button className="back-button" onClick={onBack}>
          ← {t('backToLanguages')}
        </button>
        <h2 className="language-title">{language.name}</h2>
        <p className="word-count-info">
          {wordCount} {wordCount === 1 ? t('word') : t('words')} {t('saved')}
        </p>
      </div>

      <form className="word-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="word">{t('newWord')}</label>
          <div className="input-with-button">
            <input
              id="word"
              type="text"
              value={word}
              onChange={(e) => {
                setWord(e.target.value);
                setLookupError('');
              }}
              placeholder={t('enterWord')}
              className="form-input"
              required
            />
            <button
              type="button"
              className="lookup-button"
              onClick={handleLookup}
              disabled={lookingUp || !word.trim()}
              title={t('lookupDefinition')}
            >
              {lookingUp ? '...' : '🔍'}
            </button>
          </div>
        </div>
        
        {lookupError && (
          <div className="lookup-error">
            {lookupError}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="translation">{t('translation')}</label>
          <textarea
            id="translation"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            placeholder={t('enterTranslation')}
            className="form-input form-textarea"
            required
            rows="3"
          />
        </div>
        <button type="submit" className="add-word-button" disabled={submitting}>
          {submitting ? t('adding') : t('addWord')}
        </button>
      </form>

      {language.words && language.words.length > 0 && (
        <div className="words-list">
          <h3 className="words-list-title">{t('savedWords')}</h3>
          <div className="words-grid">
            {language.words.map(w => (
              <div key={w.id} className="word-card">
                <div className="word-text">{w.word}</div>
                <div className="translation-text">{w.translation}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default WordEntry;


