import { router } from '../trpc'
import { authenticationRouter } from './authentication'
import { userRouter } from './user'

export const appRouter = router({
  user: userRouter,
  authenication: authenticationRouter,
})
