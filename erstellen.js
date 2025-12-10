document.addEventListener('DOMContentLoaded', function () {
  console.log('erstellen.js wurde geladen und DOM ist bereit');

  const formular = document.getElementById('adForm');

  if (!formular) {
    console.error('Formular mit id="adForm" nicht gefunden!');
    return;
  }

  console.log('Formular gefunden:', formular);

  formular.addEventListener('submit', async function (ereignis) {
    ereignis.preventDefault();

    const ausgewaehlteArt = document.querySelector(
      'input[name="anzeigeArt"]:checked'
    );
    const anzeigeArt = ausgewaehlteArt ? ausgewaehlteArt.value : null;

    const titel = document.getElementById('title').value.trim();
    const beschreibung = document
      .getElementById('description')
      .value.trim();

    const preisEingabe = document.getElementById('price').value;
    const preis =
      preisEingabe === '' ? null : Number(preisEingabe.replace(',', '.'));

    const preisTyp = document.getElementById('Preistyp').value;
    const kategorie = document.getElementById('category').value;

    if (!titel || !beschreibung) {
      alert('Bitte gib mindestens einen Titel und eine Beschreibung ein.');
      return;
    }

    const anzeigeDaten = {
      anzeigeArt,
      titel,
      beschreibung,
      preis,
      preisTyp,
      kategorie,
    };

    console.log('Anzeige-Daten, die zum Backend gehen:', anzeigeDaten);

        try {
      const antwort = await fetch('http://localhost:3001/api/ads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(anzeigeDaten),
      });

      if (!antwort.ok) {
        const text = await antwort.text();
        console.error('Fehlerstatus vom Server:', antwort.status, text);
        alert('Fehler beim Speichern der Anzeige. Status: ' + antwort.status);
        return;
      }

      const antwortDaten = await antwort.json();
      console.log('Antwort vom Server:', antwortDaten);

      alert('Anzeige gespeichert! ID: ' + antwortDaten.id);

      formular.reset();
      window.location.href = 'uebersicht.html';
    } catch (fehler) {
      console.error('Fetch-/Netzwerkfehler:', fehler);
      alert('Backend nicht erreichbar. Läuft server.js auf Port 3001?');
    }
  });
});






document.addEventListener('DOMContentLoaded', function () {
  console.log('erstellen.js wurde geladen und DOM ist bereit');

  const formular = document.getElementById('adForm');
  const bildEingabe = document.getElementById('images');
  const vorschauBereich = document.getElementById('bilderVorschau');

  if (!formular) {
    console.error('Formular mit id="adForm" nicht gefunden!');
    return;
  }

  console.log('Formular gefunden:', formular);

  // -----------------------------
  // Bildervorschau
  // -----------------------------
  if (bildEingabe && vorschauBereich) {
    bildEingabe.addEventListener('change', function () {
      // Alte Vorschau leeren
      vorschauBereich.innerHTML = '';

      const dateien = Array.from(bildEingabe.files || []);

      if (dateien.length === 0) {
        return;
      }

      dateien.forEach(function (datei) {
        // Nur Bilder zulassen
        if (!datei.type.startsWith('image/')) {
          return;
        }

        const leser = new FileReader();

        leser.addEventListener('load', function (ereignis) {
          const bildElement = document.createElement('img');
          bildElement.src = ereignis.target.result;
          vorschauBereich.appendChild(bildElement);
        });

        leser.readAsDataURL(datei);
      });
    });
  } else {
    console.warn('Bilderfeld oder Vorschau-Bereich nicht gefunden.');
  }
})
