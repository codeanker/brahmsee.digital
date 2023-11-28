import { router } from '../trpc'

import { accountRouter } from './account/account.router'
import { anmeldungRouter } from './anmeldung/anmeldung.router'
import { authenticationRouter } from './authentication/authentication.router'
import { gliederungRouter } from './gliederung/gliederung.router'
import { ortRouter } from './ort/ort.router'
import { personRouter } from './person/person.router'
import { unterveranstaltungRouter } from './unterveranstaltung/unterveranstaltung.router'
import { veranstaltungRouter } from './veranstaltung/veranstaltung.router'

export const serviceRouter = router({
  person: personRouter,
  authentication: authenticationRouter,
  gliederung: gliederungRouter,
  account: accountRouter,
  anmeldung: anmeldungRouter,
  veranstaltung: veranstaltungRouter,
  unterveranstaltung: unterveranstaltungRouter,
  ort: ortRouter,
})
