/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { anmeldungGliederungdListProcedure } from './anmeldungGliederungList'
import { anmeldungPublicCreateProcedure } from './anmeldungPublicCreate'
import { anmeldungTeilnehmerStornoProcedure } from './anmeldungTeilnehmerStorno'
import { anmeldungVerwaltungAblehnenProcedure } from './anmeldungVerwaltungAblehnen'
import { anmeldungVerwaltungAnnehmenProcedure } from './anmeldungVerwaltungAnnehmen'
import { anmeldungVerwaltungListProcedure } from './anmeldungVerwaltungList'
import { anmeldungVerwaltungStornoProcedure } from './anmeldungVerwaltungStorno'
// Import Routes here - do not delete this line

export const anmeldungRouter = mergeRouters(
  anmeldungPublicCreateProcedure.router,
  anmeldungTeilnehmerStornoProcedure.router,
  anmeldungVerwaltungAblehnenProcedure.router,
  anmeldungVerwaltungAnnehmenProcedure.router,
  anmeldungVerwaltungStornoProcedure.router,
  anmeldungVerwaltungListProcedure.router,
  anmeldungGliederungdListProcedure.router
  // Add Routes here - do not delete this line
)
