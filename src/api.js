const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Fetch all languages with their words
export const fetchLanguages = async () => {
  const response = await fetch(`${API_BASE_URL}/languages`);
  if (!response.ok) throw new Error('Failed to fetch languages');
  return response.json();
};

// Create a new language
export const createLanguage = async (name) => {
  const response = await fetch(`${API_BASE_URL}/languages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create language');
  }
  return response.json();
};

// Add a word to a language
export const addWord = async (languageId, word, translation) => {
  const response = await fetch(`${API_BASE_URL}/languages/${languageId}/words`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ word, translation }),
  });
  if (!response.ok) throw new Error('Failed to add word');
  return response.json();
};

// Delete a word
export const deleteWord = async (wordId) => {
  const response = await fetch(`${API_BASE_URL}/words/${wordId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete word');
  return response.json();
};

// Delete a language
export const deleteLanguage = async (languageId) => {
  const response = await fetch(`${API_BASE_URL}/languages/${languageId}`, { method: 'DELETE' });
  if (!response.ok) throw new Error('Failed to delete language');
  return response.json();
};

// ─── Lookup Log ───────────────────────────────────────────────────────────────

// Log that the user looked up a word
export const logLookup = async (word, language_id = null) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup-log`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ word, language_id }),
    });
    if (!response.ok) throw new Error('Failed to log lookup');
    return response.json();
  } catch (err) {
    // Non-critical – swallow errors so the UX is unaffected
    console.warn('Lookup log error:', err);
  }
};

// Get recent lookup history
export const fetchLookupLog = async (limit = 50) => {
  const response = await fetch(`${API_BASE_URL}/lookup-log?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch lookup log');
  return response.json();
};

// ─── Practice ─────────────────────────────────────────────────────────────────

// Get words for a practice session (priority-ordered)
export const fetchPracticeWords = async (languageId, limit = 10) => {
  const response = await fetch(`${API_BASE_URL}/practice/words/${languageId}?limit=${limit}`);
  if (!response.ok) throw new Error('Failed to fetch practice words');
  return response.json();
};

// Save practice session results
export const savePracticeResults = async (session_id, results) => {
  const response = await fetch(`${API_BASE_URL}/practice/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id, results }),
  });
  if (!response.ok) throw new Error('Failed to save practice results');
  return response.json();
};

// Get per-word accuracy stats for a language
export const fetchPracticeStats = async (languageId) => {
  const response = await fetch(`${API_BASE_URL}/practice/stats/${languageId}`);
  if (!response.ok) throw new Error('Failed to fetch practice stats');
  return response.json();
};
