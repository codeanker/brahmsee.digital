/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { activityVerwaltungListProcedure } from './activityVerwaltungList'
// Import Routes here - do not delete this line

export const activityRouter = mergeRouters(
  activityVerwaltungListProcedure.router,
  // Add Routes here - do not delete this line
)
