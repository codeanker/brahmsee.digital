import { router } from '../trpc'

import { authenticationRouter } from './authentication/authentication'
import { gliederungRouter } from './gliederung/gliederung'
import { userRouter } from './user/user'

export const serviceRouter = router({
  user: userRouter,
  authenication: authenticationRouter,
  gliederung: gliederungRouter,
})
