import { mergeRouters } from '../../trpc'

import { personAuthenticatedGetProcedure } from './personAuthenticatedGet'
import { personVerwaltungCreateProcedure } from './personVerwaltungCreate'
import { personVerwaltungGetProcedure } from './personVerwaltungGet'
import { personVerwaltungListProcedure } from './personVerwaltungList'
import { personVerwaltungPatchProcedure } from './personVerwaltungPatch'
import { personVerwaltungRemoveProcedure } from './personVerwaltungRemove'

export const personRouter = mergeRouters(
  personAuthenticatedGetProcedure.router,
  personVerwaltungGetProcedure.router,
  personVerwaltungCreateProcedure.router,
  personVerwaltungListProcedure.router,
  personVerwaltungPatchProcedure.router,
  personVerwaltungRemoveProcedure.router
)
