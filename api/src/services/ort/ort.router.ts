/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { ortListProcedure, ortCountProcedure } from './ortList'
import { ortVerwaltungCreateProcedure } from './ortVerwaltungCreate'
import { ortVerwaltungGetProcedure } from './ortVerwaltungGet'
import { ortVerwaltungPatchProcedure } from './ortVerwaltungPatch'
import { ortVerwaltungRemoveProcedure } from './ortVerwaltungRemove'
// Import Routes here - do not delete this line

export const ortRouter = mergeRouters(
  ortVerwaltungCreateProcedure.router,
  ortVerwaltungGetProcedure.router,
  ortListProcedure.router,
  ortCountProcedure.router,
  ortVerwaltungPatchProcedure.router,
  ortVerwaltungRemoveProcedure.router,
  // Add Routes here - do not delete this line
)
