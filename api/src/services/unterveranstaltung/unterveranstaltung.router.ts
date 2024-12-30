// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { unterveranstaltungGliederungCreateProcedure } from './unterveranstaltungGliederungCreate.js'
import { unterveranstaltungGliederungGetProcedure } from './unterveranstaltungGliederungGet.js'
import { unterveranstaltungGliederungPatchProcedure } from './unterveranstaltungGliederungPatch.js'
import { unterveranstaltungListProcedure, unterveranstaltungCountProcedure } from './unterveranstaltungList.js'
import { unterveranstaltungPublicGetProcedure } from './unterveranstaltungPublicGet.js'
import { unterveranstaltungVerwaltungCreateProcedure } from './unterveranstaltungVerwaltungCreate.js'
import { unterveranstaltungVerwaltungGetProcedure } from './unterveranstaltungVerwaltungGet.js'
import { unterveranstaltungVerwaltungPatchProcedure } from './unterveranstaltungVerwaltungPatch.js'

// Import Routes here - do not delete this line

export const unterveranstaltungRouter = mergeRouters(
  unterveranstaltungGliederungCreateProcedure.router,
  unterveranstaltungGliederungPatchProcedure.router,
  unterveranstaltungGliederungGetProcedure.router,
  unterveranstaltungPublicGetProcedure.router,
  unterveranstaltungVerwaltungCreateProcedure.router,
  unterveranstaltungVerwaltungPatchProcedure.router,
  unterveranstaltungVerwaltungGetProcedure.router,
  unterveranstaltungListProcedure.router,
  unterveranstaltungCountProcedure.router

  // Add Routes here - do not delete this line
)
