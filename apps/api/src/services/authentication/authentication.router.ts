// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { authenticationLoginProcedure } from './authenticationLogin.js'
// Import Routes here - do not delete this line

export const authenticationRouter = mergeRouters(
  authenticationLoginProcedure
  // Add Routes here - do not delete this line
)
