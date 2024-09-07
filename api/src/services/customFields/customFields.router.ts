/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { customFieldsGet } from './customFieldsGet'
import { customFieldsList } from './customFieldsList'
import { customFieldsUnterveranstaltungCreate } from './customFieldsUnterveranstaltungCreate'
import { customFieldsVeranstaltungCreate } from './customFieldsVeranstaltungCreate'
import { customFieldsVeranstaltungDelete } from './customFieldsVeranstaltungDelete'
import { customFieldsVeranstaltungUpdate } from './customFieldsVeranstaltungUpdate'
import { customFieldValuesUpdate } from './customFieldValuesUpdate'
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
