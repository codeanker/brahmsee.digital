import { router } from '../trpc'

import { accountRouter } from './account/account.router'
import { activityRouter } from './activity/activity.routes'
import { anmeldungRouter } from './anmeldung/anmeldung.router'
import { authenticationRouter } from './authentication/authentication.router'
import { customFieldsRouter } from './customFields/customFields.router'
import { fileRouter } from './file/file.router'
import { gliederungRouter } from './gliederung/gliederung.router'
import { ortRouter } from './ort/ort.router'
import { personRouter } from './person/person.router'
import { searchRouter } from './search/search.router'
import { systemRouter } from './system/system.router'
import { unterveranstaltungRouter } from './unterveranstaltung/unterveranstaltung.router'
import { veranstaltungRouter } from './veranstaltung/veranstaltung.router'
// Add Imports here - do not delete this line

export const serviceRouter = router({
  person: personRouter,
  authentication: authenticationRouter,
  gliederung: gliederungRouter,
  account: accountRouter,
  anmeldung: anmeldungRouter,
  veranstaltung: veranstaltungRouter,
  unterveranstaltung: unterveranstaltungRouter,
  ort: ortRouter,
  activity: activityRouter,
  search: searchRouter,
  system: systemRouter,
  customFields: customFieldsRouter,
  file: fileRouter,
  // Add Routers here - do not delete this line
})
