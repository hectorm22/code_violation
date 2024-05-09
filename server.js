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
const port = 3000;

app.use(cors());
app.set('/', path.join(__dirname, './index.html'));
app.use(express.static(__dirname));

//-----------------------------------------------------------------------------------------

function printError(err) {
    console.error("Server-side error: " + err);
}

// leaderboard data handler
app.get('/leaderboard', (req, res) => {
    const db = new sqlite3.Database('code_viol.db', (err) => {
        if (err) {
            console.error('Error getting high scores:', err);
            res.status(500).send('Internal Server Error');
            return;
        }
    });

    db.all('SELECT username, bestScore, bestTime FROM Records', (err, rows) => {
        if (err) {
            printError(err);
            db.close();
            return;
        }
        
        res.json(rows);
    });

    db.close();
});

app.post('/post_data', express.json(), (req, res) => {
    const postData = req.body; // {username: string, score: int, time: float}
    const db = new sqlite3.Database('code_viol.db', function(err) { if (err) printError(err) });

    db.serialize(() => {
        db.get("SELECT id FROM Records WHERE username = ?", [postData.username], function(err, row){
            if (err) {
                printError("data post - " + err);
                db.close();
                return;
            }

            if (row) {
                // user already exists in db.
                
                db.each("SELECT * FROM Records WHERE username = ?", [postData.username], function(err, row) {
                    if (err) {
                        printError("data post - " + err);
                        db.close();
                        return;
                    }

                    // only update if the new score is higher than the old score.
                    if (postData.score > row.bestScore)
                    {
                        db.run("UPDATE Records SET bestScore = ? WHERE username = ?", [postData.score, postData.username], function(err) {
                            if (err)
                                printError(err);

                            db.close();
                        });

                        console.log(`updated new score for ${postData.username} (${row.bestScore} -> ${postData.score})`);
                    }

                    // only update if the new time is less than the old time.
                    if (postData.time < row.bestTime)
                    {
                        db.run("UPDATE Records SET bestTime = ? WHERE username = ?", [postData.time, postData.username], function(err) {
                            if (err)
                                printError(err);
                            
                            db.close();
                        });

                        console.log(`updated new time for ${postData.username} (${row.bestTime} -> ${postData.time})`);
                    }
                });
            }
            else {
                // user doesn't exist in db. create user and update fields.
                console.log(`creating user ${postData.username} and setting its data.`);

                db.run("INSERT INTO Records (username, bestScore, bestTime) VALUES(?,?,?)", [postData.username, postData.score, postData.time], function(err) {
                    if (err) {
                        printError("data post - " + err);
                        db.close();
                        return;
                    }

                    db.close();
                });
            }
        });
    });
});

// get anything other than the root file
app.get(/[^/]*/, (req, res) => {
    res.sendFile(req.url);
});


app.listen(3000, () => {
    console.log("Code Violation started.")
    console.log(`Go to the following address in any browser: http://localhost:3000`);
});
