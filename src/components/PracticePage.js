import React, { useState, useEffect, useCallback } from 'react';
import './PracticePage.css';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchPracticeWords, savePracticeResults, fetchPracticeStats } from '../api';

// Generate a unique session ID
const makeSessionId = () =>
  `session_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

// Fisher-Yates shuffle
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Build a multiple-choice question from a word + the other words as distractors
const buildQuestion = (word, allWords) => {
  const distractors = shuffle(allWords.filter((w) => w.id !== word.id)).slice(0, 3);
  const options = shuffle([word, ...distractors]);
  return {
    word,
    prompt: word.word,
    correctId: word.id,
    options: options.map((o) => ({ id: o.id, label: o.translation })),
  };
};

// ─── Sub-views ────────────────────────────────────────────────────────────────

function LanguagePicker({ languages, onSelect, onBack, t }) {
  return (
    <div className="pp-picker">
      <h2 className="pp-section-title">{t('selectLanguageToPractice')}</h2>
      <div className="pp-lang-grid">
        {languages.map((lang) => (
          <button
            key={lang.id}
            className="pp-lang-card"
            onClick={() => onSelect(lang)}
          >
            <span className="pp-lang-name">{lang.name}</span>
            <span className="pp-lang-meta">
              {lang.word_count} {lang.word_count === 1 ? t('word') : t('words')}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Quiz({ questions, onFinish, t }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // { word_id, correct }
  const [revealed, setRevealed] = useState(false);

  const current = questions[idx];
  const progress = ((idx) / questions.length) * 100;

  const handleSelect = (optionId) => {
    if (revealed) return;
    setSelected(optionId);
    setRevealed(true);
  };

  const handleNext = () => {
    const isCorrect = selected === current.correctId;
    const newAnswers = [...answers, { word_id: current.word.id, correct: isCorrect }];
    setAnswers(newAnswers);

    if (idx + 1 >= questions.length) {
      onFinish(newAnswers);
    } else {
      setIdx(idx + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const optionClass = (optId) => {
    if (!revealed) return 'pp-option';
    if (optId === current.correctId) return 'pp-option correct';
    if (optId === selected) return 'pp-option wrong';
    return 'pp-option dimmed';
  };

  return (
    <div className="pp-quiz">
      {/* Progress bar */}
      <div className="pp-progress-bar">
        <div className="pp-progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="pp-progress-label">
        {idx + 1} / {questions.length}
      </span>

      <div className="pp-question-card">
        <p className="pp-question-hint">{t('whatIsTheDefinition')}</p>
        <h2 className="pp-question-word">{current.prompt}</h2>
      </div>

      <div className="pp-options">
        {current.options.map((opt) => (
          <button
            key={opt.id}
            className={optionClass(opt.id)}
            onClick={() => handleSelect(opt.id)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {revealed && (
        <div className={`pp-feedback ${selected === current.correctId ? 'pp-fb-correct' : 'pp-fb-wrong'}`}>
          {selected === current.correctId ? `✔ ${t('correct')}` : `✘ ${t('wrong')}`}
        </div>
      )}

      {revealed && (
        <button className="pp-next-btn" onClick={handleNext}>
          {idx + 1 >= questions.length ? t('seeResults') : t('nextQuestion')}
        </button>
      )}
    </div>
  );
}

function Results({ answers, questions, onRestart, onStats, onBack, t }) {
  const correctCount = answers.filter((a) => a.correct).length;
  const pct = Math.round((correctCount / answers.length) * 100);

  const wrongWords = answers
    .filter((a) => !a.correct)
    .map((a) => questions.find((q) => q.word.id === a.word_id)?.word)
    .filter(Boolean);

  const correctWords = answers
    .filter((a) => a.correct)
    .map((a) => questions.find((q) => q.word.id === a.word_id)?.word)
    .filter(Boolean);

  const emoji = pct === 100 ? '🏆' : pct >= 70 ? '🎉' : pct >= 40 ? '💪' : '📚';

  return (
    <div className="pp-results">
      <div className="pp-score-circle">
        <span className="pp-score-emoji">{emoji}</span>
        <span className="pp-score-pct">{pct}%</span>
        <span className="pp-score-sub">
          {correctCount}/{answers.length} {t('correct')}
        </span>
      </div>

      {wrongWords.length > 0 && (
        <div className="pp-result-section pp-wrongs">
          <h3>❌ {t('needsWork')}</h3>
          <div className="pp-word-chips">
            {wrongWords.map((w) => (
              <div key={w.id} className="pp-chip pp-chip-wrong">
                <span className="pp-chip-word">{w.word}</span>
                <span className="pp-chip-def">{w.translation}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {correctWords.length > 0 && (
        <div className="pp-result-section pp-corrects">
          <h3>✅ {t('wellDone')}</h3>
          <div className="pp-word-chips">
            {correctWords.map((w) => (
              <div key={w.id} className="pp-chip pp-chip-correct">
                <span className="pp-chip-word">{w.word}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pp-action-row">
        <button className="pp-btn pp-btn-secondary" onClick={onStats}>
          📊 {t('viewStats')}
        </button>
        <button className="pp-btn pp-btn-primary" onClick={onRestart}>
          🔄 {t('practiceAgain')}
        </button>
      </div>
      <button className="pp-btn pp-btn-ghost" onClick={onBack}>
        ← {t('backToMenu')}
      </button>
    </div>
  );
}

function StatsView({ stats, language, onBack, t }) {
  return (
    <div className="pp-stats">
      <h2 className="pp-section-title">📊 {t('statsFor')} {language.name}</h2>
      {stats.length === 0 ? (
        <p className="pp-empty">{t('noPracticeYet')}</p>
      ) : (
        <div className="pp-stats-list">
          {stats.map((s) => (
            <div key={s.id} className="pp-stat-row">
              <div className="pp-stat-word">
                <span className="pp-stat-term">{s.word}</span>
                <span className="pp-stat-def">{s.translation}</span>
              </div>
              <div className="pp-stat-badges">
                <span className="pp-badge pp-badge-correct" title={t('correct')}>
                  ✅ {s.correct_count}
                </span>
                <span className="pp-badge pp-badge-wrong" title={t('wrong')}>
                  ❌ {s.wrong_count}
                </span>
                {s.accuracy_pct !== null && (
                  <span
                    className={`pp-badge pp-badge-pct ${
                      s.accuracy_pct >= 70
                        ? 'pp-badge-good'
                        : s.accuracy_pct >= 40
                        ? 'pp-badge-ok'
                        : 'pp-badge-bad'
                    }`}
                  >
                    {s.accuracy_pct}%
                  </span>
                )}
                {s.total_attempts === 0 && (
                  <span className="pp-badge pp-badge-new">{t('new')}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <button className="pp-btn pp-btn-secondary" onClick={onBack}>
        ← {t('back')}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

function PracticePage({ languages, onBack }) {
  const { t } = useLanguage();

  const [view, setView] = useState('picker'); // picker | loading | quiz | results | stats
  const [selectedLang, setSelectedLang] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [stats, setStats] = useState([]);
  const [error, setError] = useState('');
  const [sessionId] = useState(makeSessionId);

  const practisableLangs = languages.filter(
    (l) => (l.word_count || (l.words && l.words.length)) >= 2
  );

  const startPractice = useCallback(async (lang) => {
    setSelectedLang(lang);
    setView('loading');
    setError('');
    try {
      const words = await fetchPracticeWords(lang.id, 10);
      if (words.length < 2) {
        setError(t('notEnoughWords'));
        setView('picker');
        return;
      }
      const qs = words.map((w) => buildQuestion(w, words));
      setQuestions(qs);
      setAnswers([]);
      setView('quiz');
    } catch (err) {
      setError(t('practiceLoadError'));
      setView('picker');
    }
  }, [t]);

  const handleFinish = useCallback(async (finalAnswers) => {
    setAnswers(finalAnswers);
    setView('results');
    // Persist results
    try {
      await savePracticeResults(sessionId, finalAnswers);
    } catch (err) {
      console.warn('Failed to save practice results', err);
    }
  }, [sessionId]);

  const handleViewStats = useCallback(async () => {
    if (!selectedLang) return;
    try {
      const data = await fetchPracticeStats(selectedLang.id);
      setStats(data);
      setView('stats');
    } catch (err) {
      console.warn('Failed to load stats', err);
    }
  }, [selectedLang]);

  return (
    <div className="practice-page">
      <div className="practice-container">
        {/* Header */}
        <div className="pp-header">
          <button
            className="back-button"
            onClick={
              view === 'picker'
                ? onBack
                : view === 'stats'
                ? () => setView('results')
                : () => setView('picker')
            }
          >
            ←{' '}
            {view === 'picker'
              ? t('back')
              : view === 'stats'
              ? t('backToResults')
              : t('backToMenu')}
          </button>
          <h1 className="page-title">{t('practiceTitle')}</h1>
        </div>

        {error && <div className="pp-error">{error}</div>}

        {/* Views */}
        {view === 'picker' && practisableLangs.length === 0 && (
          <div className="practice-content">
            <p className="coming-soon">🌍</p>
            <p className="no-languages-hint">{t('noLanguagesHint')}</p>
          </div>
        )}

        {view === 'picker' && practisableLangs.length > 0 && (
          <LanguagePicker
            languages={practisableLangs}
            onSelect={startPractice}
            onBack={onBack}
            t={t}
          />
        )}

        {view === 'loading' && (
          <div className="practice-content">
            <div className="pp-spinner" />
            <p className="coming-soon">{t('loading')}</p>
          </div>
        )}

        {view === 'quiz' && questions.length > 0 && (
          <Quiz questions={questions} onFinish={handleFinish} t={t} />
        )}

        {view === 'results' && (
          <Results
            answers={answers}
            questions={questions}
            onRestart={() => startPractice(selectedLang)}
            onStats={handleViewStats}
            onBack={() => setView('picker')}
            t={t}
          />
        )}

        {view === 'stats' && (
          <StatsView
            stats={stats}
            language={selectedLang}
            onBack={() => setView('results')}
            t={t}
          />
        )}
      </div>
    </div>
  );
}

export default PracticePage;
