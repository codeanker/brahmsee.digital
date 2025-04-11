---
title: Backend
order: 0
---

# {{ $frontmatter.title }}

## Struktur der Endpunkte

:::info Bedeutung
🔴 nicht benutzt

🟢 alles tutti-frutti
:::

### Person

- 🟢 person.authenticatedGet.query
- 🟢 person.verwaltungCreate.mutate
- 🟢 person.list.query
- 🟢 person.count.query
- 🟢 person.get.query
- 🟢 person.patch.mutate
- 🔴 person.verwaltungRemove.mutate

### Authentication

- 🟢 authentication.login.mutate

### Gliederung

- 🔴 gliederung.publicGet.query
- 🟢 gliederung.publicList.query
- 🟢 gliederung.verwaltungCreate.mutate
- 🟢 gliederung.verwaltungGet.query
- 🟢 gliederung.list.query
- 🟢 gliederung.count.query
- 🟢 gliederung.verwaltungPatch.mutate

### Account

- 🔴 account.activate.mutate
- 🟢 account.changePassword.mutate
- 🟢 account.gliederungAdminCreate.mutate
- 🟢 account.verwaltungCreate.mutate
- 🟢 account.verwaltungGet.query
- 🟢 account.verwaltungList.query
- 🟢 account.verwaltungCount.query
- 🔴 account.verwaltungPatch.query
- 🔴 account.emailConfirmRequest.query
- 🟢 account.emailConfirm.mutate
- 🟢 account.resetPassword.mutate
- 🟢 account.verwaltungRemove.mutate

### Anmeldung

- 🔴 anmeldung.publicCreate.mutate
- 🔴 anmeldung.teilnehmerStorno.mutate
- 🟢 anmeldung.verwaltungAblehnen.mutate
- 🟢 anmeldung.verwaltungAnnehmen.mutate
- 🟢 anmeldung.verwaltungStorno.mutate
- 🔴 anmeldung.verwaltungCreate.mutate
- 🟢 anmeldung.verwaltungPatch.mutate
- 🟢 anmeldung.gliederungPatch.mutate
- 🟢 anmeldung.count.query
- 🟢 anmeldung.list.query
- 🟢 anmeldung.get.query
- 🟢 anmeldung.zuordnen.mutate
- 🟢 anmeldung.accessTokenValidate.query
- 🟢 anmeldung.anmeldungFotoUpload.mutate

### Veranstaltung

- 🟢 veranstaltung.verwaltungCreate.mutate
- 🟢 veranstaltung.verwaltungGet.query
- 🟢 veranstaltung.verwaltungList.query
- 🟢 veranstaltung.verwaltungCount.query
- 🟢 veranstaltung.verwaltungPatch.mutate
- 🟢 veranstaltung.gliederungList.query

### Unterveranstaltung

- 🟢 unterveranstaltung.gliederungCreate.mutate
- 🟢 unterveranstaltung.gliederungPatch.mutate
- 🟢 unterveranstaltung.gliederungGet.query
- 🟢 unterveranstaltung.publicGet.query
- 🟢 unterveranstaltung.verwaltungCreate.mutate
- 🟢 unterveranstaltung.verwaltungPatch.mutate
- 🟢 unterveranstaltung.verwaltungGet.query
- 🟢 unterveranstaltung.list.query
- 🟢 unterveranstaltung.count.query

### Ort

- 🟢 ort.verwaltungCreate.mutate
- 🟢 ort.verwaltungGet.query
- 🟢 ort.list.query
- 🟢 ort.count.query
- 🟢 ort.verwaltungPatch.mutate
- 🟢 ort.verwaltungRemove.mutate

### Activity

- 🟢 activity.list.query
- 🟢 activity.count.query

### Search

- 🟢 search.search.query

### System

- 🟢 system.hostnamesGet.query

### CustomFields

- 🟢 customFields.list.query
- 🟢 customFields.get.query
- 🟢 customFields.veranstaltungCreate.mutate
- 🟢 customFields.update.mutate
- 🟢 customFields.veranstaltungDelete.mutate
- 🟢 customFields.unterveranstaltungDelete.mutate
- 🟢 customFields.unterveranstaltungCreate.mutate
- 🟢 customFields.valuesUpdate.mutate
- 🟢 customFields.listTemplates.query

### File

- 🟢 file.fileCreate.mutate
- 🟢 file.fileGetUrl.query
- 🟢 file.anmeldungPublicFotoUpload.mutate

### Address

- 🟢 address.findAddress.query

### Faq

- 🟢 faq.list.query
- 🟢 faq.searchCategory.query
- 🟢 faq.create.mutate
- 🟢 faq.update.mutate
- 🟢 faq.delete.mutate
