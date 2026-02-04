// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { customFieldsGet } from './customFieldsGet.js'
import { customFieldsList, customFieldsTable } from './customFieldsList.js'
import { customFieldsTemplates } from './customFieldsTemplates.js'
import { customFieldsUnterveranstaltungCreate } from './customFieldsUnterveranstaltungCreate.js'
import { customFieldsVeranstaltungCreate } from './customFieldsVeranstaltungCreate.js'
import { customFieldsVeranstaltungDelete, customFieldsUnterveranstaltungDelete } from './customFieldsDelete.js'
import { customFieldsUpdate } from './customFieldsUpdate.js'
import { customFieldValuesUpdate } from './customFieldValuesUpdate.js'
// Import Routes here - do not delete this line

export const customFieldsRouter = mergeRouters(
  customFieldsList,
  customFieldsTable,
  customFieldsGet,
  customFieldsVeranstaltungCreate,
  customFieldsUpdate,
  customFieldsVeranstaltungDelete,
  customFieldsUnterveranstaltungDelete,
  customFieldsUnterveranstaltungCreate,
  customFieldValuesUpdate,
  customFieldsTemplates
  // Add Routes here - do not delete this line
)
