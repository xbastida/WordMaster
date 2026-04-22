const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Fetch all languages with their words
export const fetchLanguages = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages`);
    if (!response.ok) {
      throw new Error('Failed to fetch languages');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

// Create a new language
export const createLanguage = async (name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create language');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating language:', error);
    throw error;
  }
};

// Add a word to a language
export const addWord = async (languageId, word, translation) => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages/${languageId}/words`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ word, translation }),
    });
    if (!response.ok) {
      throw new Error('Failed to add word');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
};

// Delete a word
export const deleteWord = async (wordId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/words/${wordId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete word');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
  }
};

// Delete a language
export const deleteLanguage = async (languageId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/languages/${languageId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete language');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting language:', error);
    throw error;
  }
};


