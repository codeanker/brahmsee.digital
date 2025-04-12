# e2e Test

## Todos:

- [ ] doku: wie legt man ein test an
- [ ] test szenarios herraussuchen

## Playwright

[Playwright](https://playwright.dev/) ist ein e2e-testing tool, um einfach mehrere Browser zu testen.
Man sollte Playwright nutzen, weil es Tests über mehrere Browser hinweg ermöglicht und schnell ist.
Außerdem unterstützt es parallele Tests, was Zeit spart, und bietet Funktionen wie das Aufzeichnen von Tests und das Erfassen von Screenshots.

In der GitHub Pipeline ist playwright konfiguriert, sodass Fehler schnell auffallen.

## Tests lokal ausführen

Wenn du deine apps gestartet hast via `start:apps`, können die tests via `run:test:e2e` lokal ausgeführt werden.

## Tests entwickeln

Um Tests zu entwickeln nutzen wir die playwright-ui. Diese kann via dem Task `run:test:ui` gestartet werden.
Im Ordner `tests/` können die Tests angepasst werden.

## Test-Szenarien

- Login
  - Feature: Login Email
    - ✅ Erfolgreicher Login
    - ✅ Falscher Nutzername
    - ✅ Falsches Passwort
    - ✅ Pflichtfelder
  - Feature: Passwort vergessen
    - Link von Login vorhanden/erfolgreich
    - Erfolgreiches senden
    - Pflichtfelder
  - Feature: Registrierung
  - Page: Datenschutz und Impressum
  - Feature: PublicAnmeldung
    - Anmeldestrecke als Teilnehmer
    - Anmeldestrecke als Crew
    - Foto-Upload
- Ausschreibung
  - Feature: Ausschreibung Gliederung erstellen
  - Feature: Ausschreibung Crew erstellen
  - Feature: Anmeldungsstrecke

## admin-accounts

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann Accounts liste einsehen
- Kann Accounts erstellen
- Kann Accounts details einsehen
- Kann Accounts bearbeiten einsehen

## admin-activity

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann liste einsehen
- Kann erstellen
- Kann bearbeiten

## admin-ausschreibung

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann liste einsehen
- Kann erstellen
- Kann details ansehen
- Kann bearbeiten
- Kann CustomFields anlegen
- Kann CustomFields bearbeiten
- Kann CustomFields entfernen
- Kann Dokumente hochladen (teilnehmerliste)
- Kann Dokumente hochladen (verpflegung)
- Kann Dokumente hochladen (fotos)
- Kann Bedingung einsehen
- Kann Marketing sehen
- Kann Marketing bearbeiten
- Kann Anmeldungen einsehen
- Kann FAQ sehen
- Kann FAQ bearbeiten
- Kann FAQ entfernen

## admin-components

Vorrausetzung: Nutzer hat Rolle ADMIN

- ...alle komponenten funktionieren

## admin-gliederung

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann liste einsehen
- Kann erstellen
- Kann bearbeiten
- Kann ausschreibung liste einsehen

## admin-orte

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann liste einsehen
- Kann erstellen
- Kann bearbeiten

## admin-person

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann Personen liste einsehen
- Kann Personen erstellen
- Kann Personen details einsehen
- Kann Personen bearbeiten einsehen

## admin-veranstaltung

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann liste einsehen
- Kann erstellen
- Kann details ansehen
- Kann bearbeiten
- Kann CustomFields anlegen
- Kann CustomFields bearbeiten
- Kann CustomFields entfernen
- Kann Dokumente hochladen (teilnehmerliste)
- Kann Dokumente hochladen (verpflegung)
- Kann Dokumente hochladen (fotos)
- Kann Bedingung einsehen
- Kann Ausschreibung zur Veranstaltung einsehen

## gliederung-ausschreibung

Vorrausetzung: Nutzer hat Rolle GLIEDERUNG_ADMIN

- Kann liste einsehen
- Kann erstellen
- Kann details ansehen
- Kann bearbeiten
- Kann CustomFields anlegen
- Kann CustomFields bearbeiten
- Kann CustomFields entfernen
- Kann Dokumente hochladen (teilnehmerliste)
- Kann Dokumente hochladen (verpflegung)
- Kann Dokumente hochladen (fotos)
- Kann Bedingung einsehen
- Kann Marketing sehen
- Kann Marketing bearbeiten
- Kann Anmeldungen einsehen
- Kann FAQ sehen
- Kann FAQ bearbeiten
- Kann FAQ entfernen

### public-auth

- Der Nutzer kann sich erfolgreich einloggen. Bei keinem Erfolg, bekommt dieser entsprechend Hinweise, was schief gelaufen ist.
- Eine Gliderung kann eine registrierungs-anfrage schicken.
- Via einem activationToken seinenden Nutzer aktivieren.
- Der eingeloggte Nutzer kann sich sicher ausloggen
- Kann eine Passwort zurücksetzen anfrage schicken

### public-misc

- Datenschutz ist öffentlich erreichbar
- Impressum ist öffentlich erreichbar
- Datenschutz Link ist auf der Login-Seite
- Impressum Link ist auf der Login-Seite

## public-ausschreibung

- Kann sich als Teilnehmer anmelden
- Kann sich als Crew anmelden

## user-anmeldungen

Vorrausetzung: Nutzer hat Rolle USER

- Kann liste einsehen

### user-misc

Vorrausetzung: Nutzer hat Rolle USER

- Datenschutz-link ist auf einer eingeloggten Seite
- Impressum-link ist auf einer eingeloggten Seite
- Mitwirkende einsehbar

## user-person

Vorrausetzung: Nutzer hat Rolle USER

- Kann liste einsehen
- Kann erstellen
- Kann details einsehen
- Kann bearbeiten einsehen
