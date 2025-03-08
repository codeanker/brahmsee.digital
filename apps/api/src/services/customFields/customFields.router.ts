// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { customFieldsGet } from './customFieldsGet.js'
import { customFieldsList } from './customFieldsList.js'
import { customFieldsTemplates } from './customFieldsTemplates.js'
import { customFieldsUnterveranstaltungCreate } from './customFieldsUnterveranstaltungCreate.js'
import { customFieldsVeranstaltungCreate } from './customFieldsVeranstaltungCreate.js'
import { customFieldsDelete } from './customFieldsDelete.js'
import { customFieldsUpdate } from './customFieldsUpdate.js'
import { customFieldValuesUpdate } from './customFieldValuesUpdate.js'
// Import Routes here - do not delete this line

export const customFieldsRouter = mergeRouters(
  customFieldsList.router,
  customFieldsGet.router,
  customFieldsVeranstaltungCreate.router,
  customFieldsUpdate.router,
  customFieldsDelete.router,
  customFieldsUnterveranstaltungCreate.router,
  customFieldValuesUpdate.router,
  customFieldsTemplates.router
  // Add Routes here - do not delete this line
)
