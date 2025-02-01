// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { personAuthenticatedGetProcedure } from './personAuthenticatedGet.js'
import { personGliederungGetProcedure } from './personGliederungGet.js'
import { personGliederungListProcedure } from './personGliederungList.js'
import { personGliederungPatchProcedure } from './personGliederungPatch.js'
import { personCountProcedure, personListProcedure } from './personList.js'
import { personVerwaltungCreateProcedure } from './personVerwaltungCreate.js'
import { personVerwaltungGetProcedure } from './personVerwaltungGet.js'
import { personVerwaltungPatchProcedure } from './personVerwaltungPatch.js'
import { personVerwaltungRemoveProcedure } from './personVerwaltungRemove.js'
// Import Routes here - do not delete this line

export const personRouter = mergeRouters(
  personAuthenticatedGetProcedure.router,
  personGliederungListProcedure.router,
  personVerwaltungGetProcedure.router,
  personVerwaltungCreateProcedure.router,
  personListProcedure.router,
  personCountProcedure.router,
  personVerwaltungPatchProcedure.router,
  personVerwaltungRemoveProcedure.router,
  personGliederungGetProcedure.router,
  personGliederungPatchProcedure.router
  // Add Routes here - do not delete this line
)
