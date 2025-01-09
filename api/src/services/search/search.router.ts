// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { searchProcedure } from './search.js'

// Import Routes here - do not delete this line

export const searchRouter = mergeRouters(
  searchProcedure.router
  // Add Routes here - do not delete this line
)
