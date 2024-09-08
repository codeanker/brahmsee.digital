/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { unterveranstaltungGliederungCreateProcedure } from './unterveranstaltungGliederungCreate'
import { unterveranstaltungGliederungGetProcedure } from './unterveranstaltungGliederungGet'
import { unterveranstaltungGliederungPatchProcedure } from './unterveranstaltungGliederungPatch'
import { unterveranstaltungListProcedure, unterveranstaltungCountProcedure } from './unterveranstaltungList'
import { unterveranstaltungPublicGetProcedure } from './unterveranstaltungPublicGet'
import { unterveranstaltungVerwaltungCreateProcedure } from './unterveranstaltungVerwaltungCreate'
import { unterveranstaltungVerwaltungGetProcedure } from './unterveranstaltungVerwaltungGet'
import { unterveranstaltungVerwaltungPatchProcedure } from './unterveranstaltungVerwaltungPatch'

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
  unterveranstaltungCountProcedure.router,

  // Add Routes here - do not delete this line
)
