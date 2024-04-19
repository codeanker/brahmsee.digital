/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { systemHostnamesGetProcedure } from './systemHostnamesGet'

// Import Routes here - do not delete this line

export const systemRouter = mergeRouters(
  systemHostnamesGetProcedure.router,

  // Add Routes here - do not delete this line
)
