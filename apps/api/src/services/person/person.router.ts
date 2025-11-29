// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'
import { personAuthenticatedGetProcedure } from './personAuthenticatedGet.js'
import { personGetProcedure } from './personGet.js'
import { personListProcedure } from './personList.js'
import { personVerwaltungPatchProcedure } from './personPatch.js'
import { personVerwaltungCreateProcedure } from './personVerwaltungCreate.js'
import { personVerwaltungRemoveProcedure } from './personVerwaltungRemove.js'
// Import Routes here - do not delete this line

export const personRouter = mergeRouters(
  personAuthenticatedGetProcedure,
  personVerwaltungCreateProcedure,
  personListProcedure,
  personGetProcedure,
  personVerwaltungPatchProcedure,
  personVerwaltungRemoveProcedure
  // Add Routes here - do not delete this line
)
