/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { personAuthenticatedGetProcedure } from './personAuthenticatedGet'
import { personGliederungGetProcedure } from './personGliederungGet'
import { personGliederungListProcedure } from './personGliederungList'
import { personGliederungPatchProcedure } from './personGliederungPatch'
import { personListProcedure, personCountProcedure } from './personList'
import { personTshirtGliederungPatchProcedure } from './personTshirtGliederungPatch'
import { personTshirtVerwaltungPatchProcedure } from './personTshirtVerwaltungPatch'
import { personVerwaltungCreateProcedure } from './personVerwaltungCreate'
import { personVerwaltungGetProcedure } from './personVerwaltungGet'
import { personVerwaltungPatchProcedure } from './personVerwaltungPatch'
import { personVerwaltungRemoveProcedure } from './personVerwaltungRemove'
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
  personGliederungPatchProcedure.router,
  personTshirtVerwaltungPatchProcedure.router,
  personTshirtGliederungPatchProcedure.router,
  // Add Routes here - do not delete this line
)
