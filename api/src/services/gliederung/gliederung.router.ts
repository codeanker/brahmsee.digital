import { mergeRouters } from '../../trpc'

import { gliederungPublicGetProcedure } from './gliederungPublicGet'
import { gliederungVerwaltungCreateProcedure } from './gliederungVerwaltungCreate'
import { gliederungVerwaltungGetProcedure } from './gliederungVerwaltungGet'
import { gliederungVerwaltungListProcedure } from './gliederungVerwaltungList'

export const gliederungRouter = mergeRouters(
  gliederungPublicGetProcedure.router,
  gliederungVerwaltungCreateProcedure.router,
  gliederungVerwaltungGetProcedure.router,
  gliederungVerwaltungListProcedure.router
)
