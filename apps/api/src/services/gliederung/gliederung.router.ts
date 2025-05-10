// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { gliederungListProcedure } from './gliederungList.js'
import { gliederungPublicGetProcedure } from './gliederungPublicGet.js'
import { gliederungPublicListProcedure } from './gliederungPublicList.js'
import { gliederungVerwaltungCreateProcedure } from './gliederungVerwaltungCreate.js'
import { gliederungVerwaltungGetProcedure } from './gliederungVerwaltungGet.js'
import { gliederungVerwaltungPatchProcedure } from './gliederungVerwaltungPatch.js'
// Import Routes here - do not delete this line

export const gliederungRouter = mergeRouters(
  gliederungPublicGetProcedure,
  gliederungPublicListProcedure,
  gliederungVerwaltungCreateProcedure,
  gliederungVerwaltungGetProcedure,
  gliederungListProcedure,
  gliederungVerwaltungPatchProcedure
  // Add Routes here - do not delete this line
)
