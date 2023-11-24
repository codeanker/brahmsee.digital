import { router } from '../trpc'

import { authenticationRouter } from './authentication/authentication'
import { gliederungRouter } from './gliederung/gliederung'
import { personRouter } from './user/person'

export const serviceRouter = router({
  person: personRouter,
  authenication: authenticationRouter,
  gliederung: gliederungRouter,
})
