/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { unterveranstaltungGliederungCreateProcedure } from './unterveranstaltungGliederungCreate'
import { unterveranstaltungGliederungGetProcedure } from './unterveranstaltungGliederungGet'
import { unterveranstaltungGliederungListProcedure } from './unterveranstaltungGliederungList'
import { unterveranstaltungGliederungPatchProcedure } from './unterveranstaltungGliederungPatch'
import { unterveranstaltungPublicGetProcedure } from './unterveranstaltungPublicGet'
import { unterveranstaltungVerwaltungCreateProcedure } from './unterveranstaltungVerwaltungCreate'
import { unterveranstaltungVerwaltungGetProcedure } from './unterveranstaltungVerwaltungGet'
import { unterveranstaltungVerwaltungListProcedure } from './unterveranstaltungVerwaltungList'
import { unterveranstaltungVerwaltungPatchProcedure } from './unterveranstaltungVerwaltungPatch'

// Import Routes here - do not delete this line

export const unterveranstaltungRouter = mergeRouters(
  unterveranstaltungGliederungCreateProcedure.router,
  unterveranstaltungGliederungListProcedure.router,
  unterveranstaltungGliederungPatchProcedure.router,
  unterveranstaltungGliederungGetProcedure.router,
  unterveranstaltungPublicGetProcedure.router,
  unterveranstaltungVerwaltungCreateProcedure.router,
  unterveranstaltungVerwaltungListProcedure.router,
  unterveranstaltungVerwaltungPatchProcedure.router,
  unterveranstaltungVerwaltungGetProcedure.router,

  // Add Routes here - do not delete this line
)
