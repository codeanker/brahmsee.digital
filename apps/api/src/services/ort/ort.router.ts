// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { ortListProcedure, ortCountProcedure } from './ortList.js'
import { ortVerwaltungCreateProcedure } from './ortVerwaltungCreate.js'
import { ortVerwaltungGetProcedure } from './ortVerwaltungGet.js'
import { ortVerwaltungPatchProcedure } from './ortVerwaltungPatch.js'
import { ortVerwaltungRemoveProcedure } from './ortVerwaltungRemove.js'
// Import Routes here - do not delete this line

export const ortRouter = mergeRouters(
  ortVerwaltungCreateProcedure,
  ortVerwaltungGetProcedure,
  ortListProcedure,
  ortCountProcedure,
  ortVerwaltungPatchProcedure,
  ortVerwaltungRemoveProcedure
  // Add Routes here - do not delete this line
)
