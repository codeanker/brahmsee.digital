import { mergeRouters } from '../../trpc'

import { unterveranstaltungGliederungCreateProcedure } from './unterveranstaltungGliederungCreate'
import { unterveranstaltungGliederungListProcedure } from './unterveranstaltungGliederungList'
import { unterveranstaltungGliederungPatchProcedure } from './unterveranstaltungGliederungPatch'
import { unterveranstaltungPublicGetProcedure } from './unterveranstaltungPublicGet'
import { unterveranstaltungVerwaltungCreateProcedure } from './unterveranstaltungVerwaltungCreate'
import { unterveranstaltungVerwaltungListProcedure } from './unterveranstaltungVerwaltungList'
import { unterveranstaltungVerwaltungPatchProcedure } from './unterveranstaltungVerwaltungPatch'

export const unterveranstaltungRouter = mergeRouters(
  unterveranstaltungGliederungCreateProcedure.router,
  unterveranstaltungGliederungListProcedure.router,
  unterveranstaltungGliederungPatchProcedure.router,
  unterveranstaltungPublicGetProcedure.router,
  unterveranstaltungVerwaltungCreateProcedure.router,
  unterveranstaltungVerwaltungListProcedure.router,
  unterveranstaltungVerwaltungPatchProcedure.router
)
