const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const SQLiteStore = require('connect-sqlite3')(session);
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());         // Enable CORS for all routes
app.use(cookieParser()); // Use cookie-parser middleware
app.use(session({        // Configure express-session middleware
    store: new SQLiteStore({
        db: 'sessions.db', // Path to your SQLite database file
        table: 'sessions',
        ttl: 30 * 24 * 60 * 60, // Session TTL in seconds (30 days)
    }),
    secret: 'adf2452345gfhj@33456afg', 
    resave: false,
    saveUninitialized: true,
    cookie: {  
        secure: false,                    // Set secure to true if using HTTPS
        maxAge: 30 * 24 * 60 * 60 * 1000  // 30 days in milliseconds
    } 
}));

app.use(bodyParser.json());

// Route to set the username in session
app.post('/setUsername', (req, res) => {
    const { username } = req.query;
    req.session.username = username;
    res.send('Username set in session');
});

// Route to get the username from session
app.get('/getUsername', (req, res) => {
    const username = req.session.username || 'No username set';
    res.json(username);
});

const db = new sqlite3.Database('code_viol.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
        return;
    }
    console.log('Connected to the SQLite database.');
});

app.get('/highscores', (req, res) => {
    db.all('SELECT * FROM Records ORDER BY bestScore DESC LIMIT 10', (err, rows) => {
        if (err) {
            console.error('Error getting high scores:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(rows);
    });
});

app.post('/addScores', (req, res) => {
    const { name, score } = req.body;
    // Check if data exists for the given name
    db.get('SELECT * FROM Records WHERE username = ?', [name], (err, row) => {
    if (err) {
      res.status(500).send('Error checking data in database.');
    } else if (row) {
      // Data exists, update the score
      db.run('UPDATE Records SET bestScore = ? WHERE username = ?', [score, name], (err) => {
        if (err) {
          res.status(500).send('Error updating data in database.');
        } else {
          res.status(200).send('Data updated successfully.');
        }
      });
    } else {
      // Data doesn't exist, insert new record
      db.run('INSERT INTO Records (username, bestScore) VALUES (?, ?)', [name, score], (err) => {
        if (err) {
          res.status(500).send('Error inserting data into database.');
        } else {
          res.status(200).send('Data inserted successfully.');
        }
      });
    }
  });

});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

