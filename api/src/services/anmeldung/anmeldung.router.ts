/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { anmeldungGliederungGetProcedure } from './anmeldungGliederungGet'
import { anmeldungGliederungdListProcedure } from './anmeldungGliederungList'
import { anmeldungPublicCreateProcedure } from './anmeldungPublicCreate'
import { anmeldungTeilnehmerStornoProcedure } from './anmeldungTeilnehmerStorno'
import { anmeldungVerwaltungAblehnenProcedure } from './anmeldungVerwaltungAblehnen'
import { anmeldungVerwaltungAnnehmenProcedure } from './anmeldungVerwaltungAnnehmen'
import { anmeldungVerwaltungCountProcedure, anmeldungVerwaltungListProcedure } from './anmeldungVerwaltungList'
import { anmeldungVerwaltungStornoProcedure } from './anmeldungVerwaltungStorno'
// Import Routes here - do not delete this line

export const anmeldungRouter = mergeRouters(
  anmeldungPublicCreateProcedure.router,
  anmeldungTeilnehmerStornoProcedure.router,
  anmeldungVerwaltungAblehnenProcedure.router,
  anmeldungVerwaltungAnnehmenProcedure.router,
  anmeldungVerwaltungStornoProcedure.router,
  anmeldungVerwaltungListProcedure.router,
  anmeldungGliederungdListProcedure.router,
  anmeldungGliederungGetProcedure.router,
  anmeldungVerwaltungCountProcedure.router,
  // Add Routes here - do not delete this line
)
