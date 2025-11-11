// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'
import { veranstaltungListProcedure } from './veranstaltung.list.js'
import { veranstaltungTableProcedure } from './veranstaltung.table.js'

import { veranstaltungPublicGetProcedure } from './veranstaltungPublicGet.js'
import { veranstaltungVerwaltungCreateProcedure } from './veranstaltungVerwaltungCreate.js'
import { veranstaltungVerwaltungGetProcedure } from './veranstaltungVerwaltungGet.js'
import { veranstaltungVerwaltungPatchProcedure } from './veranstaltungVerwaltungPatch.js'
// Import Routes here - do not delete this line

export const veranstaltungRouter = mergeRouters(
  veranstaltungListProcedure,
  veranstaltungTableProcedure,
  veranstaltungVerwaltungCreateProcedure,
  veranstaltungVerwaltungGetProcedure,
  veranstaltungVerwaltungPatchProcedure,
  veranstaltungPublicGetProcedure
  // Add Routes here - do not delete this line
)
