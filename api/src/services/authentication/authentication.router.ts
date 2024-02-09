/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { authenticationLoginProcedure } from './authenticationLogin'
// Import Routes here - do not delete this line

export const authenticationRouter = mergeRouters(
  authenticationLoginProcedure.router,
  // Add Routes here - do not delete this line
)
