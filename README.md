# Kühnert & Schroeder – Website

**www.kuehnertundschroeder.de** – statisches HTML/CSS/JS.
Kein Build-Schritt, keine Abhängigkeiten. Aufbau wie beim prl-Repo: GitHub → Vercel.

```
index.html          Startseite: Hero, Jetzt hören, Presse, Werbung (E-Mail-Link)
presse.html         Pressebereich (/presse)
impressum.html      Impressum (von poolartists.de übernommen)
datenschutz.html    Datenschutzerklärung (von poolartists.de übernommen)
404.html            Fehlerseite
css/style.css       Gemeinsames Designsystem für alle Seiten
js/config.js        Podcast-Links (Spotify, Apple, …)
js/site.js          Navigation, Plattform-Links, Download-Check
fonts/              Anton (Schrift des Covers, SIL Open Font License)
img/                Bilder, Cover, Favicons, OG-Bilder
vercel.json         Saubere URLs (/presse statt /presse.html)
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

## Werbeanfragen

Im Bereich „Werbung im Podcast“ gibt es kein Formular, sondern einen E-Mail-Link an
**team@kuehnertundschroeder.de** (öffnet das Mailprogramm mit Betreff „Werbeanfrage Kühnert & Schroeder“).
Adresse ändern: in `index.html` im Abschnitt `WERBUNG` an beiden Stellen.

## Besucherstatistik

Simple Analytics (ohne Cookies, kein Banner nötig) ist auf allen Seiten eingebunden.
Die Website muss im Simple-Analytics-Dashboard als `kuehnertundschroeder.de` angelegt sein.
Gezählte Klicks (Events): `hero_jetzt_hoeren`, `hoeren_spotify|apple|amazon|deezer|youtube`,
`werbung_email`, `presse_pressemappe|cover|doppelportraet|einzelportraets|logo|trailer`.
Neuen Link mitzählen: `data-track="name"` an den Link schreiben (nur Buchstaben, Ziffern, Unterstriche).
Die Datenschutzerklärung (Abschnitt IV) beschreibt den Dienst.

## Downloads im Pressebereich

Pressemappe (inkl. Pressemitteilung) und alle Einzel-Downloads (Cover, Pressefotos & Doppelporträt,
Einzelporträts & Studiofotos, Logo & Schriftzug, Trailer horizontal & vertikal) verlinken auf
Tresorit-Freigaben. Links und Vorschaubilder stehen direkt in `presse.html`
(Pressemappe oben im Hero, der Rest im Abschnitt `EINZELNE DOWNLOADS`).

## Lokal starten

```bash
npx serve .
```

## Deployment

1. Repo auf GitHub anlegen und pushen.
2. In Vercel „Add New → Project“, Repo importieren. Framework: *Other*, kein Build-Befehl.
3. Unter *Settings → Domains* `www.kuehnertundschroeder.de` (und `kuehnertundschroeder.de`) hinzufügen und die DNS-Einträge beim Domain-Anbieter setzen.
