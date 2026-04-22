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

    // Lookup log: every time a user looks up a word's definition
    db.run(`CREATE TABLE IF NOT EXISTS lookup_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word TEXT NOT NULL,
      language_id INTEGER,
      looked_up_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (language_id) REFERENCES languages(id) ON DELETE SET NULL
    )`);

    // Practice results: per-word accuracy tracking
    db.run(`CREATE TABLE IF NOT EXISTS practice_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      word_id INTEGER NOT NULL,
      session_id TEXT NOT NULL,
      correct INTEGER NOT NULL DEFAULT 0,
      practiced_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
    )`);
  });
}

// ─── Languages ────────────────────────────────────────────────────────────────

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
    if (err) { res.status(500).json({ error: err.message }); return; }

    db.all('SELECT * FROM words ORDER BY created_at DESC', [], (err, allWords) => {
      if (err) { res.status(500).json({ error: err.message }); return; }

      const languages = rows.map(lang => ({
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
  if (!name) { res.status(400).json({ error: 'Language name is required' }); return; }

  db.run('INSERT INTO languages (name) VALUES (?)', [name], function(err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint')) {
        res.status(409).json({ error: 'Language already exists' });
      } else {
        res.status(500).json({ error: err.message });
      }
      return;
    }
    db.get('SELECT * FROM languages WHERE id = ?', [this.lastID], (err, row) => {
      if (err) { res.status(500).json({ error: err.message }); return; }
      res.status(201).json({ id: row.id, name: row.name, created_at: row.created_at, words: [] });
    });
  });
});

// Delete a language (and all its words)
app.delete('/api/languages/:id', (req, res) => {
  db.run('DELETE FROM languages WHERE id = ?', [req.params.id], function(err) {
    if (err) { res.status(500).json({ error: err.message }); return; }
    if (this.changes === 0) { res.status(404).json({ error: 'Language not found' }); return; }
    res.json({ message: 'Language deleted successfully' });
  });
});

// ─── Words ────────────────────────────────────────────────────────────────────

// Get words for a specific language
app.get('/api/languages/:id/words', (req, res) => {
  db.all('SELECT * FROM words WHERE language_id = ? ORDER BY created_at DESC', [req.params.id], (err, rows) => {
    if (err) { res.status(500).json({ error: err.message }); return; }
    res.json(rows);
  });
});

// Add a word to a language
app.post('/api/languages/:id/words', (req, res) => {
  const languageId = req.params.id;
  const { word, translation } = req.body;
  if (!word || !translation) { res.status(400).json({ error: 'Word and translation are required' }); return; }

  db.get('SELECT * FROM languages WHERE id = ?', [languageId], (err, language) => {
    if (err) { res.status(500).json({ error: err.message }); return; }
    if (!language) { res.status(404).json({ error: 'Language not found' }); return; }

    db.run('INSERT INTO words (language_id, word, translation) VALUES (?, ?, ?)', [languageId, word, translation], function(err) {
      if (err) { res.status(500).json({ error: err.message }); return; }
      db.get('SELECT * FROM words WHERE id = ?', [this.lastID], (err, row) => {
        if (err) { res.status(500).json({ error: err.message }); return; }
        res.status(201).json(row);
      });
    });
  });
});

// Delete a word
app.delete('/api/words/:id', (req, res) => {
  db.run('DELETE FROM words WHERE id = ?', [req.params.id], function(err) {
    if (err) { res.status(500).json({ error: err.message }); return; }
    if (this.changes === 0) { res.status(404).json({ error: 'Word not found' }); return; }
    res.json({ message: 'Word deleted successfully' });
  });
});

// ─── Lookup Log ───────────────────────────────────────────────────────────────

// Log a word lookup
app.post('/api/lookup-log', (req, res) => {
  const { word, language_id } = req.body;
  if (!word) { res.status(400).json({ error: 'word is required' }); return; }

  db.run(
    'INSERT INTO lookup_log (word, language_id) VALUES (?, ?)',
    [word, language_id || null],
    function(err) {
      if (err) { res.status(500).json({ error: err.message }); return; }
      res.status(201).json({ id: this.lastID, word, language_id: language_id || null });
    }
  );
});

// Get recent lookup history
app.get('/api/lookup-log', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  db.all(
    `SELECT ll.*, l.name as language_name
     FROM lookup_log ll
     LEFT JOIN languages l ON ll.language_id = l.id
     ORDER BY ll.looked_up_at DESC LIMIT ?`,
    [limit],
    (err, rows) => {
      if (err) { res.status(500).json({ error: err.message }); return; }
      res.json(rows);
    }
  );
});

// ─── Practice ─────────────────────────────────────────────────────────────────

/**
 * GET /api/practice/words/:languageId
 * Returns words for a language, ordered by priority:
 *   priority = (times wrong) * 3 + (times correct) * (-1) + (never practised gets 0)
 * Words with more failures bubble to the top. Falls back to all words if none practised.
 */
app.get('/api/practice/words/:languageId', (req, res) => {
  const languageId = req.params.languageId;
  const limit = parseInt(req.query.limit) || 10;

  const query = `
    SELECT
      w.id,
      w.word,
      w.translation,
      w.language_id,
      COALESCE(SUM(CASE WHEN pr.correct = 0 THEN 1 ELSE 0 END), 0) AS wrong_count,
      COALESCE(SUM(CASE WHEN pr.correct = 1 THEN 1 ELSE 0 END), 0) AS correct_count,
      COALESCE(COUNT(pr.id), 0)                                      AS total_attempts,
      (COALESCE(SUM(CASE WHEN pr.correct = 0 THEN 1 ELSE 0 END), 0) * 3
       - COALESCE(SUM(CASE WHEN pr.correct = 1 THEN 1 ELSE 0 END), 0))
       AS priority_score
    FROM words w
    LEFT JOIN practice_results pr ON pr.word_id = w.id
    WHERE w.language_id = ?
    GROUP BY w.id
    ORDER BY priority_score DESC, RANDOM()
    LIMIT ?
  `;

  db.all(query, [languageId, limit], (err, rows) => {
    if (err) { res.status(500).json({ error: err.message }); return; }
    res.json(rows);
  });
});

/**
 * POST /api/practice/results
 * Body: { session_id, results: [{ word_id, correct }] }
 * Saves the outcome of a practice session.
 */
app.post('/api/practice/results', (req, res) => {
  const { session_id, results } = req.body;
  if (!session_id || !Array.isArray(results) || results.length === 0) {
    res.status(400).json({ error: 'session_id and results[] are required' });
    return;
  }

  const stmt = db.prepare(
    'INSERT INTO practice_results (word_id, session_id, correct) VALUES (?, ?, ?)'
  );

  db.serialize(() => {
    db.run('BEGIN TRANSACTION');
    let hasError = false;
    results.forEach(({ word_id, correct }) => {
      if (!hasError) {
        stmt.run([word_id, session_id, correct ? 1 : 0], (err) => {
          if (err) hasError = true;
        });
      }
    });
    stmt.finalize();
    if (hasError) {
      db.run('ROLLBACK');
      res.status(500).json({ error: 'Failed to save some results' });
    } else {
      db.run('COMMIT');
      res.status(201).json({ message: 'Results saved', count: results.length });
    }
  });
});

/**
 * GET /api/practice/stats/:languageId
 * Word-level accuracy stats for a language.
 */
app.get('/api/practice/stats/:languageId', (req, res) => {
  const query = `
    SELECT
      w.id,
      w.word,
      w.translation,
      COALESCE(SUM(CASE WHEN pr.correct = 1 THEN 1 ELSE 0 END), 0) AS correct_count,
      COALESCE(SUM(CASE WHEN pr.correct = 0 THEN 1 ELSE 0 END), 0) AS wrong_count,
      COALESCE(COUNT(pr.id), 0)                                      AS total_attempts,
      CASE WHEN COUNT(pr.id) = 0 THEN NULL
           ELSE ROUND(100.0 * SUM(CASE WHEN pr.correct = 1 THEN 1 ELSE 0 END) / COUNT(pr.id), 1)
      END AS accuracy_pct
    FROM words w
    LEFT JOIN practice_results pr ON pr.word_id = w.id
    WHERE w.language_id = ?
    GROUP BY w.id
    ORDER BY wrong_count DESC, accuracy_pct ASC
  `;

  db.all(query, [req.params.languageId], (err, rows) => {
    if (err) { res.status(500).json({ error: err.message }); return; }
    res.json(rows);
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  db.close((err) => {
    if (err) console.error(err.message);
    console.log('Database connection closed');
    process.exit(0);
  });
});
