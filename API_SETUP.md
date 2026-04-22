# API Setup Guide

## Automatic Word Definition Lookup

The app now supports automatic word definition lookup using online APIs. When you enter a word, you can click the 🔍 button to automatically fetch its definition.

## Setup Instructions

### Option 1: Merriam-Webster Thesaurus API (Primary - Requires API Key)

1. **Get a Free API Key**
   - Go to [https://dictionaryapi.com/](https://dictionaryapi.com/)
   - Click "Register" and create a free account
   - After logging in, go to "My Keys"
   - Request a new key for **"Collegiate Thesaurus"**
   - Free tier includes 1,000 requests/day

2. **Configure the API Key**
   - Create a `.env` file in the project root (if it doesn't exist)
   - Add your API key:
     ```
     REACT_APP_MERRIAM_WEBSTER_KEY=your_actual_api_key_here
     ```
   - Replace `your_actual_api_key_here` with your real API key

3. **Restart the App**
   - Stop the running app (Ctrl+C)
   - Run `npm run dev` again
   - The API will now work!

### Option 2: Free Dictionary API (Backup - No API Key Needed)

If you don't configure an API key, the app automatically falls back to the Free Dictionary API:
- No registration required
- No API key needed
- Works automatically
- May have fewer results than API Ninjas

## How It Works

1. **Enter a word** in the "New Word" field
2. **Click the 🔍 button** next to the input
3. The app will:
   - First try Merriam-Webster Thesaurus API (if configured)
   - Fall back to Free Dictionary API if needed
   - Display definition or synonyms in the translation field
4. **Review and edit** the definition if needed
5. **Click "Add Word"** to save

## Features

- **Automatic lookup**: Click 🔍 to fetch definitions
- **Dual API support**: Primary + backup for reliability
- **Error handling**: Clear messages if lookup fails
- **Manual override**: You can always type your own definition
- **Bilingual interface**: Works in English and Spanish

## Troubleshooting

**"API key not configured" message:**
- Make sure you created the `.env` file in the project root
- Check that the key name is exactly: `REACT_APP_MERRIAM_WEBSTER_KEY`
- Make sure you requested the "Collegiate Thesaurus" key, not the Dictionary key
- Restart the app after adding the key

**"No definition found":**
- The word might not be in the dictionary
- Try a different spelling
- Enter the definition manually

**"Failed to look up word":**
- Check your internet connection
- The API might be temporarily unavailable
- Enter the definition manually

## File Structure

```
project-root/
├── .env                          # Your API key (create this)
├── .env.example                  # Template file
├── src/
│   └── services/
│       └── dictionaryService.js  # API integration
```

## API Endpoints Used

**Merriam-Webster Thesaurus API:**
```
GET https://www.dictionaryapi.com/api/v3/references/thesaurus/json/{word}?key={YOUR_API_KEY}
Example: https://www.dictionaryapi.com/api/v3/references/thesaurus/json/happy?key=your-api-key
```

**Free Dictionary API (Backup):**
```
GET https://api.dictionaryapi.dev/api/v2/entries/en/{word}
No authentication required
```

## API Response Format

The Merriam-Webster API returns:
- **shortdef**: Short definitions of the word
- **meta.syns**: Lists of synonyms grouped by meaning
- Suggestions if the word is not found

