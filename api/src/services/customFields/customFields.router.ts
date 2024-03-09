/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { customFieldsCreateVeranstaltung } from './customFieldsCreateVeranstaltung'
import { customFieldsList } from './customFieldsList'
// Import Routes here - do not delete this line

export const customFieldsRouter = mergeRouters(
  customFieldsList.router,
  customFieldsCreateVeranstaltung.router,
  // Add Routes here - do not delete this line
)
