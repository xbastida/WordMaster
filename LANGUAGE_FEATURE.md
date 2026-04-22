# UI Language Selection Feature

## Overview
The app now supports multiple languages for the user interface. Users can switch between English and Spanish using a language selector in the top-right corner of the screen.

## Features Added

### 1. Language Switcher Component
- Located in the top-right corner of the screen
- Two buttons: EN (English) and ES (Spanish)
- Active language is highlighted
- Persists user preference in localStorage

### 2. Internationalization System
- **File**: `src/i18n.js` - Contains all translations
- **Context**: `src/contexts/LanguageContext.js` - Manages language state
- **Hook**: `useLanguage()` - Access translations in any component

### 3. Translated Components
All components now support both English and Spanish:
- Main Screen
- New Words Page
- Language Selector
- Word Entry Form
- Practice Page
- Loading states
- Error messages

## How It Works

### For Users
1. Click the **EN** or **ES** button in the top-right corner
2. The entire interface switches language immediately
3. Your preference is saved automatically

### For Developers

**Adding a new translation:**
```javascript
// In src/i18n.js
export const translations = {
  en: {
    myNewKey: 'My English text'
  },
  es: {
    myNewKey: 'Mi texto en español'
  }
};
```

**Using translations in a component:**
```javascript
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const { t } = useLanguage();
  
  return <div>{t('myNewKey')}</div>;
}
```

**Adding a new language:**
1. Add translations to `src/i18n.js`
2. Add button to `src/components/LanguageSwitcher.js`
3. Update the language codes

## Files Modified/Created

### Created:
- `src/i18n.js` - Translation strings
- `src/contexts/LanguageContext.js` - Language state management
- `src/components/LanguageSwitcher.js` - UI language selector
- `src/components/LanguageSwitcher.css` - Styles for language selector

### Modified:
- `src/index.js` - Added LanguageProvider wrapper
- `src/App.js` - Added LanguageSwitcher component
- `src/components/MainScreen.js` - Uses translations
- `src/components/NewWordsPage.js` - Uses translations
- `src/components/LanguageSelector.js` - Uses translations
- `src/components/WordEntry.js` - Uses translations
- `src/components/PracticePage.js` - Uses translations

## Translation Keys

All available translation keys can be found in `src/i18n.js`. Main categories:
- **Main Screen**: appTitle, appSubtitle, newWords, practice
- **Common**: back, loading
- **New Words**: newWordsTitle, newLanguage, yourLanguages, words, word
- **Language Selector**: selectLanguage, confirm, cancel
- **Word Entry**: newWord, translation, addWord, savedWords
- **Practice**: practiceTitle, comingSoon
- **Errors**: errorPrefix

## Testing

To test the feature:
1. Run the app: `npm run dev`
2. Click the EN/ES buttons in the top-right
3. Navigate through different pages
4. Verify all text changes language
5. Refresh the page - language preference should persist

