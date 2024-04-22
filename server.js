// Code_Violation server and database handler
const path = require('path');
const express = require('express');

const sqlite3 = require('sqlite3').verbose();

const DIST_DIR = path.join(__dirname, '/dist');
const MAIN_FILE = path.join(DIST_DIR, 'index.html');
const app = express();

app.use(express.static(DIST_DIR));

// get anythng
app.get('public/+', (_, res) => {
  res.sendFile(MAIN_FILE);
});

// test database
app.get('/data', (req, res) => {
    const db = new sqlite3.Database('code_viol.db', (err) => {
        if (err) {
            console.error('Error opening database: ' + err);
            return;
        }

        console.log('Connected to our database.');
    });

    db.all('SELECT * FROM Records', (err, rows) => {
        res.json(rows);
    });
});

app.listen(3000, () => {
    console.log(`Server running at http://localhost:3000`);
});