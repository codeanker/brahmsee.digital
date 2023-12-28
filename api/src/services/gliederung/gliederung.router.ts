/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { gliederungPublicGetProcedure } from './gliederungPublicGet'
import { gliederungVerwaltungCreateProcedure } from './gliederungVerwaltungCreate'
import { gliederungVerwaltungGetProcedure } from './gliederungVerwaltungGet'
import { gliederungVerwaltungListProcedure } from './gliederungVerwaltungList'
import { gliederungVerwaltungPatchProcedure } from './gliederungVerwaltungPatch'
// Import Routes here - do not delete this line

export const gliederungRouter = mergeRouters(
  gliederungPublicGetProcedure.router,
  gliederungVerwaltungCreateProcedure.router,
  gliederungVerwaltungGetProcedure.router,
  gliederungVerwaltungListProcedure.router,
  gliederungVerwaltungPatchProcedure.router
  // Add Routes here - do not delete this line
)
