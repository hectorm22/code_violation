/* 
    Code_Violation server and database handler
    file: server.js
    assignee: Hector M.
*/

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const cors = require("cors");
const express = require('express');

const app = express();

app.use(cors());
app.set('/', path.join(__dirname, './index.html'));
app.use(express.static(__dirname));

//-----------------------------------------------------------------------------------------

// database querying handler
app.get('/getdata', (req, res) => {
    const db = new sqlite3.Database('code_viol.db', (err) => {
        if (err) {
            console.error('Error opening database: ' + err);
            return;
        }
    });

    db.all('SELECT * FROM Records', (err, rows) => {
        res.json(rows);
    });

    db.close();
});

app.post('/postdata', (req) => {
    var userAlreadyExists = false;

    // if there are any errors, print it. otherwise don't.
    let printError = function(err) {
        if (err)
            console.error("Error: " + err);
    }

    let postDatabase = function(anyErr) {
        printError(anyErr);

        // make a prepared statement to prevent SQL injection tomfoolery.
        const postPrepStmt = (userAlreadyExists) ?
            db.prepare("UPDATE Records SET bestScore = ?, bestTime = ?, lives = ?, kills = ?, deaths = ? WHERE username = ?") :
            db.prepare("INSERT INTO Records (bestScore, bestTime, lives, kills, deaths, username) VALUES(?,?,?,?,?,?)");

        // bind each param from the url to each question mark in this order:
        try {
            postPrepStmt.run(
                req.query.bestScore,
                req.query.bestTime,
                req.query.lives,
                req.query.kills,
                req.query.deaths,
                req.query.username
            );
        }
        catch (err) {
            printError("Error posting data to database. Do the URL params of the postdata API have the correct names?");
            printError("\t" + err);
        }

        postPrepStmt.finalize(printError);
        db.close();
    }

    const db = new sqlite3.Database('code_viol.db', printError);
    const checkPrepStmt = db.prepare("SELECT COUNT(id) as cnt FROM Records WHERE username = ?");
    const usernameCount = checkPrepStmt.get(req.query.username);

    // check if user already exists so that we can update their data instead of making a new user entry each time.

    usernameCount.each(
        function(anyErr, rows) {
            if (rows.cnt > 0)
                userAlreadyExists = true;

            printError(anyErr);
            return;
        },
        postDatabase // call this function after all rows are fetched.
    );

    checkPrepStmt.finalize(printError);
});

// get anything other than the root file
app.get(/[^/]*/, (req, res) => {
    res.sendFile(req.url);
});


app.listen(3000, () => {
    console.log("Code Violation started.")
    console.log(`Go to the following address in any browser: http://localhost:3000`);
});