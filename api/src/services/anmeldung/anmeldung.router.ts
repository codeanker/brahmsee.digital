/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { anmeldungGliederungGetProcedure } from './anmeldungGliederungGet'
import { anmeldungGliederungCountProcedure, anmeldungGliederungdListProcedure } from './anmeldungGliederungList'
import { anmeldungGliederungPatchProcedure } from './anmeldungGliederungPatch'
import { anmeldungPublicCreateProcedure } from './anmeldungPublicCreate'
import { anmeldungTeilnehmerStornoProcedure } from './anmeldungTeilnehmerStorno'
import { anmeldungVerwaltungAblehnenProcedure } from './anmeldungVerwaltungAblehnen'
import { anmeldungVerwaltungAnnehmenProcedure } from './anmeldungVerwaltungAnnehmen'
import { anmeldungVerwaltungCreateProcedure } from './anmeldungVerwaltungCreate'
import { anmeldungVerwaltungGetProcedure } from './anmeldungVerwaltungGet'
import { anmeldungVerwaltungCountProcedure, anmeldungVerwaltungListProcedure } from './anmeldungVerwaltungList'
import { anmeldungVerwaltungPatchProcedure } from './anmeldungVerwaltungPatch'
import { anmeldungVerwaltungStornoProcedure } from './anmeldungVerwaltungStorno'
// Import Routes here - do not delete this line

export const anmeldungRouter = mergeRouters(
  anmeldungPublicCreateProcedure.router,
  anmeldungTeilnehmerStornoProcedure.router,
  anmeldungVerwaltungAblehnenProcedure.router,
  anmeldungVerwaltungAnnehmenProcedure.router,
  anmeldungVerwaltungStornoProcedure.router,
  anmeldungVerwaltungListProcedure.router,
  anmeldungVerwaltungCountProcedure.router,
  anmeldungVerwaltungCreateProcedure.router,
  anmeldungVerwaltungGetProcedure.router,
  anmeldungVerwaltungPatchProcedure.router,
  anmeldungGliederungdListProcedure.router,
  anmeldungGliederungCountProcedure.router,
  anmeldungGliederungGetProcedure.router,
  anmeldungGliederungPatchProcedure.router
  // Add Routes here - do not delete this line
)
