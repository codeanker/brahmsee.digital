// Prettier ignored is because this file is generated
import { mergeRouters } from "../../trpc.js"

import { customFieldsGet } from "./customFieldsGet.js"
import { customFieldsList } from "./customFieldsList.js"
import { customFieldsUnterveranstaltungCreate } from "./customFieldsUnterveranstaltungCreate.js"
import { customFieldsVeranstaltungCreate } from "./customFieldsVeranstaltungCreate.js"
import { customFieldsVeranstaltungDelete } from "./customFieldsVeranstaltungDelete.js"
import { customFieldsVeranstaltungUpdate } from "./customFieldsVeranstaltungUpdate.js"
import { customFieldValuesUpdate } from "./customFieldValuesUpdate.js"
// Import Routes here - do not delete this line

export const customFieldsRouter = mergeRouters(
  customFieldsList.router,
  customFieldsGet.router,
  customFieldsVeranstaltungCreate.router,
  customFieldsVeranstaltungUpdate.router,
  customFieldsVeranstaltungDelete.router,
  customFieldsUnterveranstaltungCreate.router,
  customFieldValuesUpdate.router,
  // Add Routes here - do not delete this line
)
