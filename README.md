# Word Master - Language Learning App

A web application for tracking new words learned in different languages with local SQLite database storage.

## Features

- **Main Screen**: Choose between "New Words" and "Practice" options
- **New Words**: 
  - Create new languages using a slider selector
  - Add words with translations to your selected languages
  - View all your saved words
- **Practice**: Coming soon!
- **Local SQL Database**: All data is stored in a local SQLite database file

## Installation

1. Install dependencies:
```bash
npm install
```

## Development

To run the app in development mode, you need to start both the backend server and the React frontend:

**Option 1: Run both together (recommended)**
```bash
npm run dev
```

**Option 2: Run separately**
```bash
# Terminal 1: Start the backend server
npm run server

# Terminal 2: Start the React frontend
npm start
```

The app will be available at `http://localhost:3000`
The API server runs on `http://localhost:3001`

## Database

The app uses SQLite for local data storage. The database file (`database.sqlite`) is created automatically in the project root when you first run the server.

## Technologies

- **Frontend**: React
- **Backend**: Express.js
- **Database**: SQLite3
- **API**: RESTful API for CRUD operations


