import { router } from '../trpc.js'

import { accountRouter } from './account/account.router.js'
import { activityRouter } from './activity/activity.routes.js'
import { addressRouter } from './address/address.router.js'
import { anmeldungRouter } from './anmeldung/anmeldung.router.js'
import { authenticationRouter } from './authentication/authentication.router.js'
import { customFieldsRouter } from './customFields/customFields.router.js'
import { faqsRouter } from './faqs/faqs.router.js'
import { fileRouter } from './file/file.router.js'
import { gliederungRouter } from './gliederung/gliederung.router.js'
import { ortRouter } from './ort/ort.router.js'
import { personRouter } from './person/person.router.js'
import { programRouter } from './program/program.router.js'
import { searchRouter } from './search/search.router.js'
import { systemRouter } from './system/system.router.js'
import { unterveranstaltungRouter } from './unterveranstaltung/unterveranstaltung.router.js'
import { veranstaltungRouter } from './veranstaltung/veranstaltung.router.js'
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
  address: addressRouter,
  faq: faqsRouter,
  program: programRouter,
  // Add Routers here - do not delete this line
})
