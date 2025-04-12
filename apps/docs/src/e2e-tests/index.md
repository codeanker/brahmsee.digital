---
title: e2e Tests
order: 0
---

# e2e Test

## Playwright

[Playwright](https://playwright.dev/) ist ein e2e-testing tool, um über mehrere Browser automatisiert zu testen.
Playwright bietet ein Tooling, um Tests lesbar und wartbar zu entwickeln.
Die Tests werden teilweise parallel ausgeführt, was Zeit spart, und bietet zeitgleich Funktionen wie das Aufzeichnen von Tests und das Erfassen von Screenshots.

## CI-Tests

Die Tests werden automatisiert via Github-Actions ausgeführt und aufgezeichnet. Sollte ein Test fehlschlagen, ist in den Artefacts der Actions das Videomaterial zu nachvollziehen.

:: TODO: screenshot einfügen

## Tests lokal ausführen

Beim starten von `start:apps`, wird playwright im UI-Modus mitgestartet und ist via http://localhost:8090 erreichbar. Dort können einzelne Tests ausgeführt und gegebenfalls debugged werden.

Alternativ können die Tests via 'run:test:e2e' im headless-Modus ausgeführt werden.

## Tests entwickeln

Um Tests zu entwickeln nutzen wir die playwright-ui. Diese ist unter http://localhost:8090 erreichbar.
Unter `packages/e2e/tests` sind alle tests angelegt und können angepasst werden.

## Test-Szenarien

:::info Emoji
🟡 Verbesserungswürdig / WIP
✅ Test ist angelegt und fertig
::

### admin-accounts

Vorrausetzung: Nutzer hat Rolle ADMIN

- 🟡Kann Accounts liste einsehen
- ✅Kann Accounts erstellen
- Kann Accounts details einsehen
- Kann Accounts bearbeiten einsehen

### admin-activity

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann liste einsehen
- Kann erstellen
- Kann bearbeiten

### admin-ausschreibung

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

### admin-components

Vorrausetzung: Nutzer hat Rolle ADMIN

- ...alle komponenten funktionieren

### admin-gliederung

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann liste einsehen
- Kann erstellen
- Kann bearbeiten
- Kann ausschreibung liste einsehen

### admin-orte

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann liste einsehen
- Kann erstellen
- Kann bearbeiten

### admin-person

Vorrausetzung: Nutzer hat Rolle ADMIN

- Kann Personen liste einsehen
- Kann Personen erstellen
- Kann Personen details einsehen
- Kann Personen bearbeiten einsehen

### admin-veranstaltung

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

### gliederung-ausschreibung

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

- ✅Der Nutzer kann sich erfolgreich einloggen. Bei keinem Erfolg, bekommt dieser entsprechend Hinweise, was schief gelaufen ist.
- Eine Gliderung kann eine registrierungs-anfrage schicken.
- Via einem activationToken seinenden Nutzer aktivieren.
- Der eingeloggte Nutzer kann sich sicher ausloggen
- Kann eine Passwort zurücksetzen anfrage schicken

#### public-misc

- ✅Datenschutz ist öffentlich erreichbar
- ✅Impressum ist öffentlich erreichbar
- Datenschutz Link ist auf der Login-Seite
- Impressum Link ist auf der Login-Seite

### public-ausschreibung

- Kann sich als Teilnehmer anmelden
- Kann sich als Crew anmelden

### user-anmeldungen

Vorrausetzung: Nutzer hat Rolle USER

- Kann liste einsehen

#### user-misc

Vorrausetzung: Nutzer hat Rolle USER

- Datenschutz-link ist auf einer eingeloggten Seite
- Impressum-link ist auf einer eingeloggten Seite
- Mitwirkende einsehbar

### user-person

Vorrausetzung: Nutzer hat Rolle USER

- Kann liste einsehen
- Kann erstellen
- Kann details einsehen
- Kann bearbeiten einsehen
