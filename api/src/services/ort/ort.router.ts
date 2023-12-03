/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { ortVerwaltungCreateProcedure } from './ortVerwaltungCreate'
import { ortVerwaltungGetProcedure } from './ortVerwaltungGet'
import { ortVerwaltungListProcedure } from './ortVerwaltungList'
// Import Routes here - do not delete this line

export const ortRouter = mergeRouters(
  ortVerwaltungCreateProcedure.router,
  ortVerwaltungGetProcedure.router,
  ortVerwaltungListProcedure.router,
  // Add Routes here - do not delete this line
)
