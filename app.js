// app.js – neues Backend für deine Kleinanzeigen-Komponente

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// --------------------
// SQLite-Datenbank
// --------------------
const datenbankPfad = path.join(__dirname, 'anzeigen_neu.db');
const db = new sqlite3.Database(datenbankPfad, (fehler) => {
  if (fehler) {
    console.error('Fehler beim Öffnen der Datenbank:', fehler.message);
  } else {
    console.log('Datenbank geöffnet:', datenbankPfad);
  }
});

// Tabelle anlegen, falls sie noch nicht existiert
db.run(
  `CREATE TABLE IF NOT EXISTS anzeigen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anzeigeArt TEXT,
      titel TEXT NOT NULL,
      beschreibung TEXT NOT NULL,
      preis REAL,
      preisTyp TEXT,
      kategorie TEXT,
      erstelltAm TEXT NOT NULL
    )`,
  (fehler) => {
    if (fehler) {
      console.error('Fehler beim Anlegen der Tabelle:', fehler.message);
    } else {
      console.log("Tabelle 'anzeigen' ist bereit.");
    }
  }
);

// Hilfsfunktionen für saubere Werte
function fixString(wert) {
  if (wert === undefined || wert === null) return null;
  const text = String(wert).trim();
  return text === '' ? null : text;
}

function fixPreis(wert) {
  if (wert === undefined || wert === null || wert === '') return null;
  const zahl = Number(wert);
  return Number.isNaN(zahl) ? null : zahl;
}

// --------------------
// POST /api/ads – Anzeige speichern
// --------------------
app.post('/api/ads', (req, res) => {
  console.log('POST /api/ads – Body:', req.body);

  let { anzeigeArt, titel, beschreibung, preis, preisTyp, kategorie } = req.body || {};

  titel = fixString(titel);
  beschreibung = fixString(beschreibung);

  if (!titel || !beschreibung) {
    return res.status(400).json({
      fehler: 'Titel und Beschreibung sind Pflichtfelder.'
    });
  }

  const daten = {
    anzeigeArt: fixString(anzeigeArt),
    titel,
    beschreibung,
    preis: fixPreis(preis),
    preisTyp: fixString(preisTyp) || 'keine Angabe',
    kategorie: fixString(kategorie) || 'Sonstiges / keine Angabe',
    erstelltAm: new Date().toISOString()
  };

  const sql = `
    INSERT INTO anzeigen
      (anzeigeArt, titel, beschreibung, preis, preisTyp, kategorie, erstelltAm)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const werte = [
    daten.anzeigeArt,
    daten.titel,
    daten.beschreibung,
    daten.preis,
    daten.preisTyp,
    daten.kategorie,
    daten.erstelltAm
  ];

  db.run(sql, werte, function (fehler) {
    if (fehler) {
      console.error('SQLite-Fehler beim Speichern:', fehler);
      return res.status(500).json({ fehler: fehler.message });
    }

    const neueAnzeige = {
      id: this.lastID,
      ...daten
    };

    console.log('Anzeige gespeichert:', neueAnzeige);
    res.status(201).json(neueAnzeige);
  });
});

// --------------------
// GET /api/ads – alle Anzeigen lesen
// --------------------
app.get('/api/ads', (req, res) => {
  const sql = `
    SELECT id, anzeigeArt, titel, beschreibung, preis, preisTyp, kategorie, erstelltAm
    FROM anzeigen
    ORDER BY id DESC
  `;

  db.all(sql, [], (fehler, zeilen) => {
    if (fehler) {
      console.error('SQLite-Fehler beim Lesen:', fehler);
      return res.status(500).json({ fehler: fehler.message });
    }

    res.json(zeilen);
  });
});

// --------------------
// Server starten
// --------------------
app.listen(PORT, () => {
  console.log(`Backend läuft auf http://localhost:${PORT}`);
});
