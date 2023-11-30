import { mergeRouters } from '../../trpc'

import { veranstaltungVerwaltungCreateProcedure } from './veranstaltungVerwaltungCreate'
import { veranstaltungVerwaltungGetProcedure } from './veranstaltungVerwaltungGet'
import { veranstaltungVerwaltungListProcedure } from './veranstaltungVerwaltungList'
import { veranstaltungVerwaltungPatchProcedure } from './veranstaltungVerwaltungPatch'

export const veranstaltungRouter = mergeRouters(
  veranstaltungVerwaltungCreateProcedure.router,
  veranstaltungVerwaltungGetProcedure.router,
  veranstaltungVerwaltungListProcedure.router,
  veranstaltungVerwaltungPatchProcedure.router
)
