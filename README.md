# Einbürgerungstest – Üben in deinem Tempo

Eine kostenlose, responsive Lernwebsite zur Vorbereitung auf den deutschen Einbürgerungstest. Wähle 10, 30, 50, 100 oder 300 Fragen, beantworte sie in deinem eigenen Tempo und erhalte am Ende eine übersichtliche Auswertung.

## Funktionen

- 300 selbst erstellte Frageformulierungen aus 100 Themenfeldern zu Demokratie, Geschichte, Geografie und Zusammenleben.
- Fünf frei wählbare Testlängen; Fragen und Antwortmöglichkeiten werden gemischt.
- Navigation zwischen Fragen, markierte Antworten und eine Übersicht zum Testfortschritt.
- Ergebnis mit richtigen, falschen und offenen Antworten sowie Prozentwert.
- Antwortübersicht nach dem Test.
- Läuft ohne Anmeldung, Backend, Tracking oder externe JavaScript-Bibliotheken.
- Verantwortlich für das Projekt: **ruslan**.

## Hinweis zum Fragenkatalog

Die Fragen auf dieser Website sind **selbst erstelltes Übungsmaterial und keine amtlichen BAMF-Originalfragen**. Die 300 Formulierungen behandeln 100 Themenfelder in verschiedenen Fragevarianten. Die Website ist nicht mit dem BAMF verbunden oder von ihm bestätigt und ersetzt weder den offiziellen Fragenkatalog noch die Prüfung. Für die aktuellen Originalmaterialien und verbindliche Informationen besuche die [Website des BAMF zum Einbürgerungstest](https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/Einbuergerung/einbuergerung-node.html).

Der amtliche Einbürgerungstest besteht aus 33 Fragen. Die Anzahl, Auswahl und Darstellung in dieser Lernwebsite dienen ausschließlich dem Üben und sind kein amtliches Prüfungsergebnis.

## Lokal starten

Es werden keine Pakete benötigt. Im Projektordner einen lokalen Webserver starten, zum Beispiel mit Python:

```bash
python -m http.server 8000
```

Anschließend `http://localhost:8000` im Browser öffnen.

## Auf GitHub Pages veröffentlichen

Der Workflow unter `.github/workflows/pages.yml` veröffentlicht die statische Website bei jedem Push auf `main`.

1. In GitHub **Settings → Pages** öffnen.
2. Unter **Build and deployment** als Quelle **GitHub Actions** auswählen.
3. Änderungen nach `main` übertragen. Den Veröffentlichungsstatus zeigt der Tab **Actions**.

## Projektdateien

<img width="1880" height="936" alt="image" src="https://github.com/user-attachments/assets/08225772-c503-4a79-9a24-860b78ef80f0" />
powered by ruslan.


- `index.html` – deutsche Benutzeroberfläche
- `styles.css` – Gestaltung für Desktop und Mobilgeräte
- `app.js` – Testablauf, Navigation und Auswertung
- `questions.js` – selbst erstellter Übungsfragenpool
