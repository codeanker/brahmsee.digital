// Prettier ignored is because this file is generated
import { mergeRouters } from "../../trpc.js"

import { activityListProcedure, activityCountProcedure } from "./activityList.js"
// Import Routes here - do not delete this line

export const activityRouter = mergeRouters(
  activityListProcedure.router,
  activityCountProcedure.router,
  // Add Routes here - do not delete this line
)
