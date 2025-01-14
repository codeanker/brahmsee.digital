// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'
import { settingsGetProcedure } from './settingsGet.js'

// Import Routes here - do not delete this line

export const settingsRouter = mergeRouters(
  settingsGetProcedure.router
  // Add Routes here - do not delete this line
)
