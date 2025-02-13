# Struktur für Routen

- 🟢Veranstaltung (im Scope)

  - 🟢Dashboard / Home Übersicht... `veranstaltung/:id/dashboard`
  - 🟢Auswertung `veranstaltung/:id/auswertung`
    - 🟢Verpflegung `veranstaltung/:id/auswertung/verpflegung`
    - 🟢Anmeldungen / Kosten, Personen ... `veranstaltung/:id/auswertung/anmeldungen`
  - 🟢Anmeldungen `veranstaltung/:id/anmeldungen`
    - 🟢Crew `veranstaltung/:id/anmeldungen/crew`
    - 🟢Gliederung `veranstaltung/:id/anmeldungen/gliederungen`
    - 🟢Teilnehmende `veranstaltung/:id/anmeldungen/gliederungen/:gliederungId/teilnehmende`
  - 🟢Programm `veranstaltung/:id/programm`
    - 🟢List `veranstaltung/:id/programm`
    - 🟢Detail `veranstaltung/:id/programm/:programmId`
    - 🟢Create `veranstaltung/:id/programm/erstellen`
  - 🟢Lageplan `veranstaltung/:id/lageplan`

- 🟢Einstellungen / Verwaltung `verwaltung`
  - 🟢Gliederungsaccount Anfrage `verwaltung/gliederungen/anfragen`
  - 🟢Gliederungen `verwaltung/gliederungen`
    - 🟢List `verwaltung/gliederungen`
    - 🟢Detail `verwaltung/gliederungen/:id`
    - 🟢Create `verwaltung/gliederungen/erstellen`
  - 🟢Veranstaltungen `verwaltung/veranstaltung`
    - 🟢List `verwaltung/veranstaltung`
    - 🟢Detail `verwaltung/veranstaltung/:id`
    - 🟢Create `verwaltung/veranstaltung/erstellen`
  - 🟢Benutzer `verwaltung/benutzer`
    - 🟢List `verwaltung/benutzer`
    - 🟢Detail `verwaltung/benutzer/:id`
    - 🟢Create `verwaltung/benutzer/erstellen`
  - 🟢 Orte (Häuser, Zeltplätze, Räume) `verwaltung/orte`
    - 🟢List `verwaltung/orte`
    - 🟢Detail `verwaltung/orte/:id`
    - 🟢Create `verwaltung/orte/erstellen`
