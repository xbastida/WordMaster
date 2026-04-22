import React, { useState, useEffect } from 'react';
import './MainScreen.css';
import { useLanguage } from '../contexts/LanguageContext';

const HELLO_WORDS = [
  { word: 'Hello', lang: 'English' },
  { word: 'Hola', lang: 'Spanish' },
  { word: 'Bonjour', lang: 'French' },
  { word: 'Hallo', lang: 'German' },
  { word: 'Ciao', lang: 'Italian' },
  { word: 'Olá', lang: 'Portuguese' },
  { word: 'Привет', lang: 'Russian' },
  { word: '你好', lang: 'Chinese' },
  { word: 'こんにちは', lang: 'Japanese' },
  { word: '안녕하세요', lang: 'Korean' },
  { word: 'مرحبا', lang: 'Arabic' },
  { word: 'नमस्ते', lang: 'Hindi' },
  { word: 'Hej', lang: 'Swedish' },
  { word: 'Merhaba', lang: 'Turkish' },
  { word: 'Γειά σου', lang: 'Greek' },
  { word: 'שלום', lang: 'Hebrew' },
  { word: 'สวัสดี', lang: 'Thai' },
];

function MainScreen({ onNavigate }) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HELLO_WORDS.length);
    }, 2000); // Change every 2 seconds

    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="main-screen">
      <div className="hello-words-background">
        {HELLO_WORDS.map((item, index) => (
          <div
            key={index}
            className="floating-hello"
            style={{
              animationDelay: `${index * 0.5}s`,
              left: `${(index * 15) % 100}%`,
              top: `${(index * 20) % 100}%`,
            }}
          >
            {item.word}
          </div>
        ))}
      </div>
      
      <div className="main-container">
        <div className="animated-hello">
          <span className="hello-word">{HELLO_WORDS[currentIndex].word}</span>
          <span className="hello-lang">({HELLO_WORDS[currentIndex].lang})</span>
        </div>
        
        <h1 className="main-title">{t('appTitle')}</h1>
        <p className="main-subtitle">{t('appSubtitle')}</p>
        <div className="button-container">
          <button 
            className="main-button new-words-button"
            onClick={() => onNavigate('new-words')}
          >
            {t('newWords')}
          </button>
          <button 
            className="main-button practice-button"
            onClick={() => onNavigate('practice')}
          >
            {t('practice')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainScreen;


