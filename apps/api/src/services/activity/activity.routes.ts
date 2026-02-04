// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { activityCompleteSubjectsProcedure, activityListProcedure } from './activityList.js'
// Import Routes here - do not delete this line

export const activityRouter = mergeRouters(
  activityListProcedure,
  activityCompleteSubjectsProcedure
  // Add Routes here - do not delete this line
)
