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

Zunächst müssen die playwright dependencies installiert werden. Dazu muss lediglich der Task `install:playwright` ausgeführt werden.

Danach kann via Task `run:test:e2e` die Tests ausgeführt werden.

## Tests entwickeln

Sind die playwright dependencies installiert (`install:playwright`) muss zusätzlich noch ein xserver installiert/gestartet werden.
Dieser wird gebraucht, um die Playwright UI zu nutzen. Die Playwright UI ist zum entwickeln und debuggen von Tests äußerst hilfreich.

- todo: xserver oder ähnliches installieren, da im devcontainer kein xserver vorhanden ist.

Danach über den Task `start:test:e2e:ui` gestartet werden und in dem Ordner `tests/`die Tests geschrieben werden.

## Test-Szenarien

- Login
  - Feature: Login Email
    - ✅ Erfolgreicher Login
    - ✅ Falscher Nutzername
    - ✅ Falsches Passwort
    - ✅ Pflichtfelder
  - Feature: Login DLRG
    - Note: kann man das testen?
  - Feature: Passwort vergessen
    - Link von Login vorhanden/erfolgreich
    - Erfolgreiches senden
    - Pflichtfelder
- Ausschreibung
  - Feature: Ausschreibung Gliederung erstellen
  - Feature: Ausschreibung Crew erstellen
  - Feature: Anmeldungsstrecke
