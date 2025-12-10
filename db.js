// db.js
// Diese Datei stellt die Verbindung zur SQLite-Datenbank her
// und exportiert das "db"-Objekt, mit dem wir später arbeiten.

const Database = require('better-sqlite3');

// Öffnet (oder erstellt, falls nicht vorhanden) die Datei "anzeigen.db"
// Die Datei liegt im gleichen Ordner wie db.js (also im backend-Ordner).
const db = new Database('anzeigen.db');

// Tabelle "anzeigen" anlegen, falls noch nicht vorhanden
db.prepare(`
  CREATE TABLE IF NOT EXISTS anzeigen (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,          -- 'biete' oder 'suche'
    title TEXT NOT NULL,
    description TEXT,
    price REAL,
    price_type TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`).run();

// Wir exportieren das db-Objekt, damit andere Dateien (z.B. server.js)
// es verwenden können.
module.exports = db;
