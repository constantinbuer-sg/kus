# Kühnert & Schroeder – Website

**www.kuehnertundschroeder.de** – statisches HTML/CSS/JS plus eine Serverless-Funktion fürs Werbeformular.
Kein Build-Schritt, keine Abhängigkeiten. Aufbau wie beim prl-Repo: GitHub → Vercel.

```
index.html          Startseite: Hero, Jetzt hören, Presse, Werbung + Formular
presse.html         Pressebereich (/presse)
impressum.html      Impressum (von poolartists.de übernommen)
datenschutz.html    Datenschutzerklärung (von poolartists.de übernommen)
404.html            Fehlerseite
css/style.css       Gemeinsames Designsystem für alle Seiten
js/config.js        Podcast-Links (Spotify, Apple, …)
js/site.js          Navigation, Plattform-Links, Download-Check, Formular
api/contact.js      Werbeformular → E-Mail via Resend (Vercel Function)
fonts/              Anton (Schrift des Covers, SIL Open Font License)
img/                Bilder, Cover, Favicons, OG-Bilder
downloads/          Presse-Downloads
vercel.json         Saubere URLs (/presse statt /presse.html)
.env.example        Benötigte Environment Variables fürs Formular
```

Header und Footer stehen in jeder HTML-Datei gleich drin (markiert mit `HEADER` / `FOOTER`).
Bei Änderungen dort bitte in allen fünf Dateien anpassen.

## Podcast-Links eintragen

In **`js/config.js`** die `"#"` durch die echten URLs ersetzen:

```js
const podcastLinks = {
  spotify: "https://open.spotify.com/show/…",
  apple: "https://podcasts.apple.com/…",
  amazon: "#",
  deezer: "#",
  youtube: "#",
};
```

Solange ein Link `"#"` ist, zeigt die Startseite „Folgt in Kürze“ und der Eintrag ist nicht klickbar.

Logos: Spotify, Apple Podcasts, Deezer und YouTube stammen aus [Simple Icons](https://simpleicons.org) (CC0).
Das Amazon-Music-Logo steckt als Maske in `css/style.css` (`.logo-amazon`).

## Werbeformular

Das Formular schickt an `/api/contact`, die Funktion versendet über [Resend](https://resend.com).
In Vercel unter **Settings → Environment Variables** eintragen (siehe `.env.example`):

| Variable | Inhalt |
|---|---|
| `RESEND_API_KEY` | API-Key aus Resend |
| `CONTACT_TO_EMAIL` | **Empfänger der Anfragen** – mehrere mit Komma trennen |
| `CONTACT_FROM_EMAIL` | Absender, z. B. `Kühnert & Schroeder <formular@kuehnertundschroeder.de>` – die Domain muss in Resend verifiziert sein |

Die Empfänger-Adresse ändert man also in Vercel, nicht im Code. Nach einer Änderung einmal neu deployen.
Antworten gehen per „Antworten“ direkt an die Person, die das Formular ausgefüllt hat (Reply-To).

Spam-Schutz: verstecktes Honeypot-Feld, Pflichtfelder, E-Mail-Prüfung, Längenbegrenzung – im Browser und auf dem Server.
Ohne JavaScript funktioniert das Formular auch (Weiterleitung mit Rückmeldung).

## Downloads im Pressebereich

Die einzelnen Downloads (Cover, Pressefotos & Doppelporträt, Einzelporträts & Studiofotos,
Logo & Schriftzug, Trailer) verlinken auf Tresorit-Freigaben. Links und Vorschaubilder stehen
direkt in `presse.html` im Abschnitt `EINZELNE DOWNLOADS`.

Die Pressemappe (großer Button oben) ist noch nicht fertig: Sobald sie da ist, als
`downloads/kuehnert-und-schroeder-pressemappe.pdf` ablegen – der Button wird dann automatisch aktiv.

## Lokal starten

Mit Formular-Funktion (empfohlen):

```bash
npx vercel dev
```

Nur die Seiten ansehen (Formular schickt dann ins Leere):

```bash
npx serve .
```

## Deployment

1. Repo auf GitHub anlegen und pushen.
2. In Vercel „Add New → Project“, Repo importieren. Framework: *Other*, kein Build-Befehl.
3. Environment Variables aus der Tabelle oben eintragen.
4. Unter *Settings → Domains* `www.kuehnertundschroeder.de` (und `kuehnertundschroeder.de`) hinzufügen und die DNS-Einträge beim Domain-Anbieter setzen.
5. In Resend die Absender-Domain verifizieren (DNS-Einträge, die Resend anzeigt).
