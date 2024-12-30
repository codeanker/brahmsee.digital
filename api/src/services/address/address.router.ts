// Prettier ignored is because this file is generated
import { mergeRouters } from "../../trpc.js"

import { addressFindActionProcedure } from "./addressFindAddress.js"
// Import Routes here - do not delete this line

export const addressRouter = mergeRouters(
  addressFindActionProcedure.router,
  // Add Routes here - do not delete this line
)
