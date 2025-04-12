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
