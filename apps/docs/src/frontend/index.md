---
title: Frontend
order: 0
---

# {{ $frontmatter.title }}

## Struktur von Routen

:::info Bedeutung
🔴 nicht benutzt

🟡 in entwicklung

🔵 funktioniert, aber kritik auszusetzen

🟣 weiß noch nicht / nicht richtig nachgeschaut

🟢 alles tutti-frutti

⚪️ test-file angelegt

🧪 tests angelegt
:::

### Public

- 🟡 \* (404)

#### Auth

- 🧪🟢 login
- ⚪️🟢 password-reset
- ⚪️🟢 password-reset/:token

#### Public

- 🧪🟢 public/datenschutz
- 🧪🟢 public/impressum

#### PublicAnmeldung

- ⚪️🟢 ausschreibung/:unterveranstaltungId
- ⚪️🟢 ausschreibung/:unterveranstaltungId/anmeldung
- ⚪️🟢 ausschreibung/:unterveranstaltungId/anmeldung/result
- ⚪️🟡 ausschreibung/:unterveranstaltungId/anmeldung/foto-upload

#### Registrierung

- ⚪️🟢 registrierung
- ⚪️🟢 registrierung/gliederung
- 🟢 registrierung/gliederung/callback
- ⚪️🟣 registrierung/:activationToken

### Intern

- 🟡 dashboard

#### Veranstaltung

- 🔴 veranstaltung/:veranstaltungId
- 🔴 veranstaltung/:veranstaltungId/dashboard
- 🔴 veranstaltung/:veranstaltungId/lageplan
- 🔴 veranstaltung/:veranstaltungId/anmeldungen/overview
- 🔴 veranstaltung/:veranstaltungId/anmeldungen/teilnehmende
- 🔴 veranstaltung/:veranstaltungId/anmeldungen/crew
- 🔴 veranstaltung/:veranstaltungId/anmeldungen/gliederungen
- 🔴 veranstaltung/:veranstaltungId/anmeldungen/create
- 🔴 veranstaltung/:veranstaltungId/auswertung
- 🔴 veranstaltung/:veranstaltungId/auswertung/verpflegung
- 🔴 veranstaltung/:veranstaltungId/auswertung/anmeldungen
- 🔴 veranstaltung/:veranstaltungId/programm/list
- 🔴 veranstaltung/:veranstaltungId/programm/:programmId
- 🔴 veranstaltung/:veranstaltungId/programm/erstellen

#### Verwaltung

##### Gliederung

- ⚪️🟢 verwaltung/gliederungen/liste
- ⚪️🟢 verwaltung/gliederungen/erstellen
- ⚪️🟢 verwaltung/gliederungen/:gliederungId
- 🔴 verwaltung/gliederungen/anfrage

##### Orte

- ⚪️🟢 verwaltung/orte/liste
- ⚪️🟢 verwaltung/orte/erstellen
- ⚪️🟢 verwaltung/orte/:ortId

##### Personen

- ⚪️🟢 verwaltung/persons/list
- ⚪️🟢 verwaltung/persons/create
- ⚪️🟢 verwaltung/persons/:personId/detail

##### Veranstaltungen

- ⚪️🟢 verwaltung/veranstaltung/liste
- ⚪️🟢 verwaltung/veranstaltung/erstellen
- ⚪️🟢 verwaltung/veranstaltung/:veranstaltungId/edit
- ⚪️🟢 verwaltung/veranstaltung/:veranstaltungId
- ⚪️🟢 verwaltung/veranstaltung/:veranstaltungId/fields/create
- ⚪️🟢 verwaltung/veranstaltung/:veranstaltungId/fields/:fieldId

##### Accounts

- ⚪️🟢 verwaltung/accounts/list
- ⚪️🟢 verwaltung/accounts/create
- ⚪️🟢 verwaltung/accounts/:accountId/detail

##### Meine Daten

- 🟢🔵 /my/persons
- 🟢🔵 /my/anmeldungen
- 🟣🔵 /my/anmeldung-zuordnen

#### Development

- ⚪️🟢 development/components
- ⚪️🟢 development/mitwirkende

#### Unterveranstaltung

- 🟢 unterveranstaltung/list
- 🟢🔵 unterveranstaltung/create/:veranstaltungId?
- 🟢 unterveranstaltung/:unterveranstaltungId/edit
- 🟢 unterveranstaltung/:unterveranstaltungId
- 🟢 unterveranstaltung/:unterveranstaltungId/fields/create
- 🟢 unterveranstaltung/:unterveranstaltungId/fields/:fieldId

#### Activity

- 🟢 activity/list
