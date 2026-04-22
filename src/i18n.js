// Internationalization translations
export const translations = {
  en: {
    // Main Screen
    appTitle: 'Word Master',
    appSubtitle: 'Track your language learning journey',
    newWords: 'New Words',
    practice: 'Practice',
    
    // Common
    back: 'Back',
    loading: 'Loading...',
    
    // New Words Page
    newWordsTitle: 'New Words',
    newLanguage: 'New Language',
    yourLanguages: 'Your Languages',
    words: 'words',
    word: 'word',
    
    // Language Selector
    selectLanguage: 'Select a Language',
    searchLanguage: 'Search languages...',
    noLanguagesFound: 'No languages found',
    selected: 'Selected',
    confirm: 'Confirm',
    cancel: 'Cancel',
    allLanguagesAdded: "You've added all available languages!",
    
    // Word Entry
    backToLanguages: 'Back to Languages',
    saved: 'saved',
    newWord: 'New Word',
    enterWord: 'Enter the word',
    translation: 'Translation / Definition',
    enterTranslation: 'Enter the translation or definition',
    addWord: 'Add Word',
    adding: 'Adding...',
    savedWords: 'Saved Words',
    lookupDefinition: 'Look up definition',
    enterWordFirst: 'Please enter a word first',
    noDefinitionFound: 'No definition found for this word',
    lookupFailed: 'Failed to look up word. Please enter manually.',
    apiKeyMissing: 'Merriam-Webster API key not configured. Using free dictionary.',
    
    // Practice Page
    practiceTitle: 'Practice',
    comingSoon: 'Practice feature coming soon!',
    noLanguagesHint: 'Add at least 2 words to a language to start practicing.',
    selectLanguageToPractice: 'Choose a language to practice',
    whatIsTheDefinition: 'What is the definition of…',
    correct: 'Correct',
    wrong: 'Wrong',
    nextQuestion: 'Next →',
    seeResults: 'See Results',
    needsWork: 'Needs work',
    wellDone: 'Well done',
    viewStats: 'View Stats',
    practiceAgain: 'Practice Again',
    backToMenu: 'Back to Menu',
    backToResults: 'Back to Results',
    statsFor: 'Stats for',
    noPracticeYet: 'No practice sessions yet for this language.',
    notEnoughWords: 'You need at least 2 words to practice.',
    practiceLoadError: 'Failed to load practice words. Please try again.',
    new: 'New',

    // Errors
    errorPrefix: 'Failed to load languages. Make sure the server is running.',

    // UI Language Selector
    uiLanguage: 'Language'
  },
  es: {
    // Main Screen
    appTitle: 'Word Master',
    appSubtitle: 'Sigue tu progreso aprendiendo idiomas',
    newWords: 'Nuevas Palabras',
    practice: 'Practicar',
    
    // Common
    back: 'Atrás',
    loading: 'Cargando...',
    
    // New Words Page
    newWordsTitle: 'Nuevas Palabras',
    newLanguage: 'Nuevo Idioma',
    yourLanguages: 'Tus Idiomas',
    words: 'palabras',
    word: 'palabra',
    
    // Language Selector
    selectLanguage: 'Selecciona un Idioma',
    searchLanguage: 'Buscar idiomas...',
    noLanguagesFound: 'No se encontraron idiomas',
    selected: 'Seleccionado',
    confirm: 'Confirmar',
    cancel: 'Cancelar',
    allLanguagesAdded: '¡Has añadido todos los idiomas disponibles!',
    
    // Word Entry
    backToLanguages: 'Volver a Idiomas',
    saved: 'guardadas',
    newWord: 'Nueva Palabra',
    enterWord: 'Introduce la palabra',
    translation: 'Traducción / Definición',
    enterTranslation: 'Introduce la traducción o definición',
    addWord: 'Añadir Palabra',
    adding: 'Añadiendo...',
    savedWords: 'Palabras Guardadas',
    lookupDefinition: 'Buscar definición',
    enterWordFirst: 'Por favor, introduce una palabra primero',
    noDefinitionFound: 'No se encontró definición para esta palabra',
    lookupFailed: 'Error al buscar la palabra. Por favor, introduce manualmente.',
    apiKeyMissing: 'Clave API de Merriam-Webster no configurada. Usando diccionario gratuito.',
    
    // Practice Page
    practiceTitle: 'Practicar',
    comingSoon: '¡Función de práctica próximamente!',
    noLanguagesHint: 'Añade al menos 2 palabras a un idioma para empezar a practicar.',
    selectLanguageToPractice: 'Elige un idioma para practicar',
    whatIsTheDefinition: '¿Cuál es la definición de…',
    correct: 'Correcto',
    wrong: 'Incorrecto',
    nextQuestion: 'Siguiente →',
    seeResults: 'Ver Resultados',
    needsWork: 'Necesita repaso',
    wellDone: '¡Bien hecho!',
    viewStats: 'Ver Estadísticas',
    practiceAgain: 'Practicar de nuevo',
    backToMenu: 'Volver al Menú',
    backToResults: 'Volver a Resultados',
    statsFor: 'Estadísticas de',
    noPracticeYet: 'Todavía no hay sesiones de práctica para este idioma.',
    notEnoughWords: 'Necesitas al menos 2 palabras para practicar.',
    practiceLoadError: 'Error al cargar palabras. Inténtalo de nuevo.',
    new: 'Nueva',

    // Errors
    errorPrefix: 'Error al cargar idiomas. Asegúrate de que el servidor esté ejecutándose.',

    // UI Language Selector
    uiLanguage: 'Idioma'
  }
};

export const getTranslation = (lang, key) => {
  return translations[lang]?.[key] || translations.en[key] || key;
};

