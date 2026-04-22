// Dictionary API service using Merriam-Webster Thesaurus API
const API_KEY = process.env.REACT_APP_MERRIAM_WEBSTER_KEY;
const BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json';

/**
 * Fetch word definition and synonyms from Merriam-Webster Thesaurus API
 * @param {string} word - The word to look up
 * @returns {Promise<Object>} - Object with synonyms and definition
 */
export const lookupWord = async (word) => {
  if (!API_KEY || API_KEY === 'your_api_key_here') {
    throw new Error('API key not configured. Please add REACT_APP_MERRIAM_WEBSTER_KEY to your .env file');
  }

  try {
    const response = await fetch(`${BASE_URL}/${encodeURIComponent(word)}?key=${API_KEY}`, {
      method: 'GET',
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Word not found');
      }
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Check if we got valid results (array of entries)
    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('Word not found');
    }

    // Check if first result is a string (suggestion) rather than an entry
    if (typeof data[0] === 'string') {
      throw new Error('Word not found. Did you mean: ' + data.slice(0, 3).join(', ') + '?');
    }

    return data;
  } catch (error) {
    console.error('Error looking up word:', error);
    throw error;
  }
};

/**
 * Get a simple definition from Merriam-Webster data
 * @param {Array} data - Data from Merriam-Webster API
 * @returns {string} - A formatted definition
 */
export const formatDefinition = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return '';
  }

  const entry = data[0];
  
  // Get the short definition if available
  if (entry.shortdef && entry.shortdef.length > 0) {
    return entry.shortdef[0];
  }

  // Get synonyms from meta data
  if (entry.meta && entry.meta.syns && entry.meta.syns.length > 0) {
    const synonyms = entry.meta.syns[0].slice(0, 5); // Get first 5 synonyms
    return synonyms.join(', ');
  }

  return '';
};

/**
 * Alternative: Use Free Dictionary API as backup
 * @param {string} word - The word to look up
 * @returns {Promise<string>} - Definition
 */
export const lookupWordFreeDictionary = async (word) => {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
    
    if (!response.ok) {
      throw new Error('Word not found');
    }

    const data = await response.json();
    
    if (data && data[0] && data[0].meanings && data[0].meanings[0]) {
      const firstDefinition = data[0].meanings[0].definitions[0].definition;
      return firstDefinition;
    }
    
    throw new Error('No definition found');
  } catch (error) {
    console.error('Error with Free Dictionary API:', error);
    throw error;
  }
};

