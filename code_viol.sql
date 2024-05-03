DROP TABLE IF EXISTS Records;
CREATE TABLE Records (
	id	        INTEGER NOT NULL,
	username	TEXT NOT NULL,
	bestScore	INTEGER NOT NULL DEFAULT 0,
	bestTime	FLOAT NOT NULL DEFAULT 0.0, -- whole part: minutes, fractional part: seconds
	lives	    INTEGER NOT NULL DEFAULT 0,
	kills	    INTEGER NOT NULL DEFAULT 0,
	deaths	    INTEGER NOT NULL DEFAULT 0,
	PRIMARY KEY("id" AUTOINCREMENT)
);