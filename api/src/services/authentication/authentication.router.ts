import { mergeRouters } from '../../trpc'

import { authenticationLoginProcedure } from './authenticationLogin'

export const authenticationRouter = mergeRouters(authenticationLoginProcedure.router)
