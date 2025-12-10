document.addEventListener('DOMContentLoaded', async function () {
    const container = document.getElementById('anzeigenListe');

    if (!container) {
        console.error('Element mit id="anzeigenListe" nicht gefunden!');
        return;
    }

    try {
        // 1. Anzeigen vom Backend holen
        const antwort = await fetch('http://localhost:3001/api/ads');
        if (!antwort.ok) {
            throw new Error('Serverantwort war nicht OK: ' + antwort.status);
        }

        const anzeigen = await antwort.json();
        console.log('Anzeigen vom Server:', anzeigen);

        // 2. Für jede Anzeige eine Kachel bauen
        if (anzeigen.length === 0) {
            container.textContent = 'Noch keine Anzeigen vorhanden.';
            return;
        }

        anzeigen.forEach(anzeige => {
            const kachel = document.createElement('article');
            kachel.className = 'anzeige-kachel';

            kachel.innerHTML = `
                <h3 class="anzeige-titel">${anzeige.titel}</h3>
                <p class="anzeige-preis">
                    ${anzeige.preis} € 
                    ${anzeige.preisTyp ? '(' + anzeige.preisTyp + ')' : ''}
                </p>
                <p class="anzeige-kategorie">${anzeige.kategorie || ''}</p>
                <p class="anzeige-art">${anzeige.anzeigeArt === 'suche' ? 'Suche' : 'Biete'}</p>
                <p class="anzeige-beschreibung">${anzeige.beschreibung}</p>
            `;

            container.appendChild(kachel);
        });

    } catch (fehler) {
        console.error('Fehler beim Laden der Anzeigen:', fehler);
        container.textContent = 'Fehler beim Laden der Anzeigen.';
    }
});
