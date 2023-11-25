import { router } from '../trpc'

import { accountRouter } from './account/account'
import { anmeldungRouter } from './anmeldung/anmeldung'
import { authenticationRouter } from './authentication/authentication'
import { gliederungRouter } from './gliederung/gliederung'
import { personRouter } from './person/person'
import { veranstaltungRouter } from './veranstaltung/veranstaltung'

export const serviceRouter = router({
  person: personRouter,
  authenication: authenticationRouter,
  gliederung: gliederungRouter,
  account: accountRouter,
  anmeldung: anmeldungRouter,
  veranstaltung: veranstaltungRouter,
})
