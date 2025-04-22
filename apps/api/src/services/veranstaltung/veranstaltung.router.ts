// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { veranstaltungGliederungListProcedure } from './veranstaltungGliederungList.js'
import { veranstaltungPublicGetProcedure } from './veranstaltungPublicGet.js'
import { veranstaltungVerwaltungCreateProcedure } from './veranstaltungVerwaltungCreate.js'
import { veranstaltungVerwaltungGetProcedure } from './veranstaltungVerwaltungGet.js'
import {
  veranstaltungVerwaltungListProcedure,
  veranstaltungVerwaltungCountProcedure,
} from './veranstaltungVerwaltungList.js'
import { veranstaltungVerwaltungPatchProcedure } from './veranstaltungVerwaltungPatch.js'
// Import Routes here - do not delete this line

export const veranstaltungRouter = mergeRouters(
  veranstaltungVerwaltungCreateProcedure,
  veranstaltungVerwaltungGetProcedure,
  veranstaltungVerwaltungListProcedure,
  veranstaltungVerwaltungCountProcedure,
  veranstaltungVerwaltungPatchProcedure,
  veranstaltungGliederungListProcedure,
  veranstaltungPublicGetProcedure
  // Add Routes here - do not delete this line
)
