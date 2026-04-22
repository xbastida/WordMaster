const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Languages table
    db.run(`CREATE TABLE IF NOT EXISTS languages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Words table
    db.run(`CREATE TABLE IF NOT EXISTS words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      language_id INTEGER NOT NULL,
      word TEXT NOT NULL,
      translation TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE CASCADE
    )`);
  });
}

// API Routes

// Get all languages with word counts
app.get('/api/languages', (req, res) => {
  const query = `
    SELECT 
      l.id,
      l.name,
      l.created_at,
      COUNT(w.id) as word_count
    FROM languages l
    LEFT JOIN words w ON l.id = w.language_id
    GROUP BY l.id, l.name, l.created_at
    ORDER BY l.created_at DESC
  `;

  db.all(query, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    // Fetch words for each language
    const languagesWithWords = rows.map(lang => ({
      id: lang.id,
      name: lang.name,
      created_at: lang.created_at,
      word_count: lang.word_count
    }));

    // Get words for all languages
    db.all('SELECT * FROM words ORDER BY created_at DESC', [], (err, allWords) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Group words by language_id
      const languages = languagesWithWords.map(lang => ({
        ...lang,
        words: allWords.filter(w => w.language_id === lang.id).map(w => ({
          id: w.id,
          word: w.word,
          translation: w.translation,
          created_at: w.created_at
        }))
      }));

      res.json(languages);
    });
  });
});

// Create a new language
app.post('/api/languages', (req, res) => {
  const { name } = req.body;

  if (!name) {
    res.status(400).json({ error: 'Language name is required' });
    return;
  }

  const query = 'INSERT INTO languages (name) VALUES (?)';
  db.run(query, [name], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint')) {
        res.status(409).json({ error: 'Language already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }

    // Return the newly created language
    db.get('SELECT * FROM languages WHERE id = ?', [this.lastID], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.status(201).json({
        id: row.id,
        name: row.name,
        created_at: row.created_at,
        words: []
      });
    });
  });
});

// Get words for a specific language
app.get('/api/languages/:id/words', (req, res) => {
  const languageId = req.params.id;
  const query = 'SELECT * FROM words WHERE language_id = ? ORDER BY created_at DESC';

  db.all(query, [languageId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Add a word to a language
app.post('/api/languages/:id/words', (req, res) => {
  const languageId = req.params.id;
  const { word, translation } = req.body;

  if (!word || !translation) {
    res.status(400).json({ error: 'Word and translation are required' });
    return;
  }

  // First verify the language exists
  db.get('SELECT * FROM languages WHERE id = ?', [languageId], (err, language) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!language) {
      res.status(404).json({ error: 'Language not found' });
      return;
    }

    // Insert the word
    const query = 'INSERT INTO words (language_id, word, translation) VALUES (?, ?, ?)';
    db.run(query, [languageId, word, translation], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }

      // Return the newly created word
      db.get('SELECT * FROM words WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        res.status(201).json(row);
      });
    });
  });
});

// Delete a word
app.delete('/api/words/:id', (req, res) => {
  const wordId = req.params.id;
  const query = 'DELETE FROM words WHERE id = ?';

  db.run(query, [wordId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Word not found' });
      return;
    }
    res.json({ message: 'Word deleted successfully' });
  });
});

// Delete a language (and all its words)
app.delete('/api/languages/:id', (req, res) => {
  const languageId = req.params.id;
  const query = 'DELETE FROM languages WHERE id = ?';

  db.run(query, [languageId], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Language not found' });
      return;
    }
    res.json({ message: 'Language deleted successfully' });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed');
    process.exit(0);
  });
});




