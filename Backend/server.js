const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) {
    console.error('Could not open database:', err.message);
  } else {
    console.log('Connected to SQLite database');
  }
});

// Create table for posts
db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  content TEXT,
  completed BOOLEAN
)`);

// API routes
app.get('/posts', (req, res) => {
  db.all(`SELECT * FROM posts`, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ posts: rows });
  });
});

app.post('/posts', (req, res) => {
  const { title, content, completed } = req.body;
  db.run(`INSERT INTO posts (title, content, completed) VALUES (?, ?, ?)`,
    [title, content, completed ? 1 : 0],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ postId: this.lastID });
    }
  );
});

app.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;
  db.run(`DELETE FROM posts WHERE id = ?`, postId, function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ deleted: true });
  });
});

app.put('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const { completed } = req.body;
  db.run(`UPDATE posts SET completed = ? WHERE id = ?`, [completed, postId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ updated: true });
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
