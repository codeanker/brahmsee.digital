/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { veranstaltungVerwaltungCreateProcedure } from './veranstaltungVerwaltungCreate'
import { veranstaltungVerwaltungGetProcedure } from './veranstaltungVerwaltungGet'
import { veranstaltungVerwaltungListProcedure } from './veranstaltungVerwaltungList'
import { veranstaltungVerwaltungPatchProcedure } from './veranstaltungVerwaltungPatch'
// Import Routes here - do not delete this line

export const veranstaltungRouter = mergeRouters(
  veranstaltungVerwaltungCreateProcedure.router,
  veranstaltungVerwaltungGetProcedure.router,
  veranstaltungVerwaltungListProcedure.router,
  veranstaltungVerwaltungPatchProcedure.router,
  // Add Routes here - do not delete this line
)
