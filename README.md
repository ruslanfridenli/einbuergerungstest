# Einbürgerungstest – Lernen in deinem Tempo

Eine kostenlose, responsive Lernwebsite mit unabhängigen Wissensübungen, einer Prüfungssimulation, Deutsch-Lernmodulen und Orientierung für den Alltag in Deutschland. Die Inhalte laufen ohne Anmeldung, Backend, Tracking-Skript oder externe JavaScript-Bibliotheken.

## Angebote

- 300 selbst erstellte Frageformulierungen aus 100 Themenfeldern; jede Formulierung hat vier Antwortmöglichkeiten.
- Themenrunden zu Demokratie und Grundrechten, Geschichte sowie Alltag und Zusammenleben.
- Wählbare Wissensrunden mit 10, 30, 50, 100 oder 300 Fragen (abhängig von der Themenauswahl).
- Eine 33-Fragen-Simulation mit 60 Minuten, 30 allgemeinen Übungsfragen und drei Fragen für das gewählte Bundesland. Die Simulation nutzt eine Übungsschwelle von 17 richtigen Antworten; sie enthält keine amtlichen Fragen und ist kein Prüfungsergebnis.
- Antworterklärungen, verständliche Erklärungen zu politischen Begriffen, Wiederholung falscher oder offener Fragen und ein druckbarer Fehlerbericht.
- Deutsch-Lernbeispiele von A1 bis C1 mit Wortschatz, Grammatik-Quiz, Alltagssituationen sowie Vorlesen und Diktat.
- Browser-Vorlesefunktion, Tastaturbedienung (1–4 und Enter), Hell-/Dunkel-Design und eine installierbare PWA mit Offline-Nutzung nach dem ersten Laden.
- Ein freiwilliger, nicht-klinischer Selbstreflexions-Check-in ohne Punktzahl, Diagnose oder wissenschaftlichen Anspruch.
- Optionaler Lernzähler in `localStorage`, standardmäßig ausgeschaltet. Es werden nur Anzahl und Richtig-Zähler pro Frage gespeichert, niemals die ausgewählten Antworten. Die Daten lassen sich in der Oberfläche löschen.
- Orientierung zur Anmeldung bei einer Prüfstelle mit dem Hinweis, die konkreten Dokumente und Fristen direkt dort zu bestätigen.

## Amtliche Prüfung und Quellen

Die Fragen auf dieser Website sind **selbst erstelltes Übungsmaterial und keine amtlichen BAMF-Originalfragen**. Die Website ist unabhängig, nicht mit dem BAMF verbunden oder von ihm bestätigt und ersetzt weder amtliche Materialien noch eine Prüfung. Für aktuelle Informationen zum Einbürgerungstest besuche die [Website des BAMF](https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/Einbuergerung/einbuergerung-node.html).

Die Simulation orientiert sich am Format mit 33 Fragen, 60 Minuten und drei Fragen zum Bundesland. Sie verwendet einen selbst erstellten Fragenpool und eine Übungsschwelle von 17 richtigen Antworten. Ergebnisse sind kein amtlicher Nachweis. Verbindliche Informationen zur Anmeldung, zu benötigten Dokumenten und zu Terminen erteilt die zuständige Prüfstelle.

## Selbstständiges Deutschlernen

Die fünf Lernkarten bieten jeweils ausgewählte Beispiele für A1, A2, B1, B2 und C1. Sie sind Lernimpulse und kein vollständiger Sprachkurs oder Einstufungstest. Vorlesen und Diktatvergleich nutzen die Sprachfunktionen des Browsers; dafür kann eine deutsche Sprachausgabe erforderlich sein.

## Selbstreflexion, Sicherheit und Datenschutz

Der Check-in ist eine kurze Einladung zum Innehalten. Er ist **kein psychologischer Test**, kein wissenschaftlich validiertes Instrument und kann keine psychische Erkrankung erkennen. Er bietet keine medizinische, therapeutische oder rechtliche Beratung. Antworten werden nur vorübergehend im Arbeitsspeicher der geöffneten Seite gehalten; die Anwendung sendet sie nicht an ein Konto oder eine App-Datenbank und speichert sie nicht dauerhaft. Beim Schließen oder Neuladen der Seite gehen sie verloren. Der Hosting-Anbieter kann technische Zugriffsdaten nach seinen eigenen Bedingungen verarbeiten.

Für allgemeine Rückmeldungen gibt es einen E-Mail-Kontakt zu `ruslanfridenli@proton.me`; dieser öffnet eine leere Nachricht im Mailprogramm. Die freiwillige Tippfehler-Meldung kann die aktuelle Frage in eine Nachricht übernehmen. Beide Funktionen verschicken nichts automatisch und fügen keine Antworten aus Übungen an. Bitte keine sensiblen Gesundheits- oder persönlichen Daten per E-Mail senden.

Die Inhalte versprechen weder ein bestimmtes Prüfungsergebnis noch eine universelle rechtliche Bewertung. Bei persönlicher Belastung wende dich an eine qualifizierte Fachperson oder eine örtliche Beratungsstelle. Bei akuter Gefahr nutze den örtlichen Notruf; in Deutschland bietet die [TelefonSeelsorge](https://www.telefonseelsorge.de/) Unterstützung.

## Lokal starten

Es werden keine Pakete benötigt. Im Projektordner einen lokalen Webserver starten, zum Beispiel mit Python:

```bash
python -m http.server 8000
```

Anschließend `http://localhost:8000` im Browser öffnen.

## Tests

Mit Node.js die Struktur und Antwortdaten des Fragenkatalogs prüfen:

```bash
node --test
```

## Auf GitHub Pages veröffentlichen

Der Workflow unter `.github/workflows/pages.yml` veröffentlicht die statische Website bei jedem Push auf `main`.

1. In GitHub **Settings → Pages** öffnen.
2. Unter **Build and deployment** als Quelle **GitHub Actions** auswählen.
3. Änderungen nach `main` übertragen. Den Veröffentlichungsstatus zeigt der Tab **Actions**.

## Projektdateien

- `index.html` – deutsche Benutzeroberfläche, Themenauswahl und FAQ
- `styles.css` – Gestaltung für Desktop und Mobilgeräte
- `app.js` – Simulation, Wissensrunden, Lernmodule, Fortschritt, Navigation und Auswertung
- `questions.js` – selbst erstellter Übungsfragenpool
- `tests/questions.test.js` – automatisierte Strukturprüfungen des Fragenkatalogs
- `manifest.webmanifest`, `sw.js`, `icon.svg` – PWA-Metadaten, Offline-Cache und App-Symbol
