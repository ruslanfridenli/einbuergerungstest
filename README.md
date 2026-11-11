# Einbürgerungstest – Üben in deinem Tempo

Eine kostenlose, responsive Lernwebsite mit unabhängigen Wissensübungen zu Demokratie, Geschichte und Zusammenleben sowie einem freiwilligen Check-in zur Selbstreflexion. Die Inhalte sind deutschsprachig und laufen ohne Anmeldung, Backend, Tracking-Skript oder externe JavaScript-Bibliotheken.

## Angebote

- 300 selbst erstellte Frageformulierungen aus 100 Themenfeldern; jede Formulierung hat vier Antwortmöglichkeiten.
- Themenrunden zu Demokratie und Grundrechten, Geschichte sowie Alltag und Zusammenleben.
- Wählbare Wissensrunden mit 10, 30, 50, 100 oder 300 Fragen (abhängig von der Themenauswahl).
- Gemischte Fragen und Antwortmöglichkeiten, Navigation, Fortschrittsanzeige und Auswertung.
- Ein freiwilliger, nicht-klinischer Selbstreflexions-Check-in ohne Punktzahl, Diagnose oder wissenschaftlichen Anspruch.
- Responsive Darstellung, Tastaturbedienung und reduzierte Animationen bei entsprechender Systemeinstellung.

## Amtliche Prüfung und Quellen

Die Fragen auf dieser Website sind **selbst erstelltes Übungsmaterial und keine amtlichen BAMF-Originalfragen**. Die Website ist unabhängig, nicht mit dem BAMF verbunden oder von ihm bestätigt und ersetzt weder amtliche Materialien noch eine Prüfung. Für aktuelle Informationen zum Einbürgerungstest besuche die [Website des BAMF](https://www.bamf.de/DE/Themen/Integration/ZugewanderteTeilnehmende/Einbuergerung/einbuergerung-node.html).

Der amtliche Einbürgerungstest umfasst 33 Fragen. Die Testlängen und Ergebnisse dieser Lernwebsite dienen ausschließlich dem Üben und sind kein amtliches Prüfungsergebnis.

## Selbstreflexion, Sicherheit und Datenschutz

Der Check-in ist eine kurze Einladung zum Innehalten. Er ist **kein psychologischer Test**, kein wissenschaftlich validiertes Instrument und kann keine psychische Erkrankung erkennen. Er bietet keine medizinische, therapeutische oder rechtliche Beratung. Antworten werden nur vorübergehend im Arbeitsspeicher der geöffneten Seite gehalten; die Anwendung sendet sie nicht an ein Konto oder eine App-Datenbank und speichert sie nicht dauerhaft. Beim Schließen oder Neuladen der Seite gehen sie verloren. Der Hosting-Anbieter kann technische Zugriffsdaten nach seinen eigenen Bedingungen verarbeiten.

Für freiwillige Rückmeldungen gibt es einen E-Mail-Kontakt zu `ruslanfridenli@proton.me`. Der Link öffnet eine leere Nachricht im Mailprogramm der besuchenden Person; Antworten aus Übungen werden nicht an E-Mails angehängt oder automatisch weitergeleitet. Bitte keine sensiblen Gesundheits- oder persönlichen Daten per E-Mail senden.

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
- `app.js` – Testablauf, Reflexions-Check-in, Navigation und Auswertung
- `questions.js` – selbst erstellter Übungsfragenpool
- `tests/questions.test.js` – automatisierte Strukturprüfungen des Fragenkatalogs
