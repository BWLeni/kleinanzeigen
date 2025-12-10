document.addEventListener('DOMContentLoaded', function () {
    console.log('erstellen.js wurde geladen und DOM ist bereit');

    const formular = document.getElementById('adForm');
 
    if (!formular) {
        console.error('Formular mit id="adForm" nicht gefunden!');
        return;
    }

    console.log('Formular gefunden:', formular);

    // WICHTIG: async, damit wir await nutzen dürfen
    formular.addEventListener('submit', async function (ereignis) {
        // Seite soll nicht neu laden
        ereignis.preventDefault();

        // --- 1. Werte aus dem Formular lesen ---

        const anzeigeArtEingabe = document.querySelector('input[name="anzeigeArt"]:checked');
        const anzeigeArt = anzeigeArtEingabe ? anzeigeArtEingabe.value : null;

        const titel = document.getElementById('title').value;
        const beschreibung = document.getElementById('description').value;
        const preis = document.getElementById('price').value;
        const preisTyp = document.getElementById('Preistyp').value;
        const kategorie = document.getElementById('category').value;

        // Objekt, das wir an das Backend schicken
        const anzeigeDaten = {
            anzeigeArt,
            titel,
            beschreibung,
            preis,
            preisTyp,
            kategorie
        };

        console.log('Anzeige-Daten, die zum Backend gehen:', anzeigeDaten);

        // --- 2. Daten an dein Backend schicken ---

        try {
            const antwort = await fetch('http://localhost:3001/api/ads', {
                method: 'POST',                          // HTTP-Methode
                headers: {
                    'Content-Type': 'application/json'   // Wir schicken JSON
                },
                body: JSON.stringify(anzeigeDaten)       // Objekt -> JSON-Text
            });

            if (!antwort.ok) {
                console.error('Fehlerstatus vom Server:', antwort.status);
                alert('Fehler beim Speichern der Anzeige.');
                return;
            }

            // Antwort vom Server auslesen (z. B. { id: 1, ... })
            const antwortDaten = await antwort.json();
            console.log('Antwort vom Server:', antwortDaten);

            alert('Anzeige gespeichert! ID: ' + antwortDaten.id);

            // Formular leeren
            formular.reset();

        } catch (fehler) {
            console.error('Fetch-/Netzwerkfehler:', fehler);
            alert('Backend nicht erreichbar. Läuft server.js auf Port 3001?');
        }
    });
});


const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// "Mini-Datenbank" im Arbeitsspeicher
let naechsteId = 1;
const anzeigen = [];

app.post('/api/ads', (req, res) => {
  console.log('Anfrage /api/ads empfangen. Body:', req.body);

  const {
    anzeigeArt,
    titel,
    beschreibung,
    preis,
    preisTyp,
    kategorie
  } = req.body;

  const neueAnzeige = {
    id: naechsteId++,
    anzeigeArt,
    titel,
    beschreibung,
    preis,
    preisTyp,
    kategorie,
    erstelltAm: new Date().toISOString()
  };

  anzeigen.push(neueAnzeige); // im Speicher merken

  res.status(201).json(neueAnzeige);
});
app.get('/api/ads', (req, res) => {
  // Neueste zuerst zurückgeben
  const sortierteAnzeigen = [...anzeigen].sort((a, b) =>
    b.id - a.id
  );
  res.json(sortierteAnzeigen);
});
