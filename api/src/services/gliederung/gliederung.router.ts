/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { gliederungListProcedure, gliederungCountProcedure } from './gliederungList'
import { gliederungPublicGetProcedure } from './gliederungPublicGet'
import { gliederungPublicListProcedure } from './gliederungPublicList'
import { gliederungVerwaltungCreateProcedure } from './gliederungVerwaltungCreate'
import { gliederungVerwaltungGetProcedure } from './gliederungVerwaltungGet'
import { gliederungVerwaltungPatchProcedure } from './gliederungVerwaltungPatch'
// Import Routes here - do not delete this line

export const gliederungRouter = mergeRouters(
  gliederungPublicGetProcedure.router,
  gliederungPublicListProcedure.router,
  gliederungVerwaltungCreateProcedure.router,
  gliederungVerwaltungGetProcedure.router,
  gliederungListProcedure.router,
  gliederungCountProcedure.router,
  gliederungVerwaltungPatchProcedure.router
  // Add Routes here - do not delete this line
)
