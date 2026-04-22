import React, { useState, useEffect } from 'react';
import './App.css';
import MainScreen from './components/MainScreen';
import NewWordsPage from './components/NewWordsPage';
import PracticePage from './components/PracticePage';
import LanguageSwitcher from './components/LanguageSwitcher';
import { fetchLanguages, createLanguage, addWord } from './api';
import { useLanguage } from './contexts/LanguageContext';

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    loadLanguages();
  }, []);

  const loadLanguages = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLanguages();
      setLanguages(data);
    } catch (err) {
      setError(t('errorPrefix'));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLanguage = async (languageName) => {
    try {
      const newLanguage = await createLanguage(languageName);
      await loadLanguages(); // Reload to get updated list
      return newLanguage;
    } catch (err) {
      setError(err.message || 'Failed to create language');
      throw err;
    }
  };

  const handleAddWord = async (languageId, word, translation) => {
    try {
      await addWord(languageId, word, translation);
      await loadLanguages(); // Reload to get updated words
    } catch (err) {
      setError(err.message || 'Failed to add word');
      throw err;
    }
  };

  if (loading) {
    return (
      <div className="App">
        <LanguageSwitcher />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          fontSize: '1.2rem',
          color: '#667eea'
        }}>
          {t('loading')}
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <LanguageSwitcher />
      {error && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '20px',
          background: '#f3526c',
          color: 'white',
          padding: '15px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
          zIndex: 1000
        }}>
          {error}
          <button 
            onClick={() => setError(null)}
            style={{
              marginLeft: '10px',
              background: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
      )}
      {currentPage === 'main' && (
        <MainScreen onNavigate={setCurrentPage} />
      )}
      {currentPage === 'new-words' && (
        <NewWordsPage
          languages={languages}
          onAddLanguage={handleAddLanguage}
          onAddWord={handleAddWord}
          onBack={() => setCurrentPage('main')}
        />
      )}
      {currentPage === 'practice' && (
        <PracticePage
          languages={languages}
          onBack={() => setCurrentPage('main')}
        />
      )}
    </div>
  );
}

export default App;


