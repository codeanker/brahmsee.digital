// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { anmeldungGetProcedure } from './anmeldungGet.js'
import { anmeldungGliederungPatchProcedure } from './anmeldungGliederungPatch.js'
import { anmeldungCountProcedure, anmeldungListProcedure } from './anmeldungList.js'
import { anmeldungPublicCreateProcedure } from './anmeldungPublicCreate.js'
import { anmeldungTeilnehmerStornoProcedure } from './anmeldungTeilnehmerStorno.js'
import { anmeldungVerwaltungAblehnenProcedure } from './anmeldungVerwaltungAblehnen.js'
import { anmeldungVerwaltungAnnehmenProcedure } from './anmeldungVerwaltungAnnehmen.js'
import { anmeldungVerwaltungCreateProcedure } from './anmeldungVerwaltungCreate.js'
import { anmeldungVerwaltungPatchProcedure } from './anmeldungVerwaltungPatch.js'
import { anmeldungVerwaltungStornoProcedure } from './anmeldungVerwaltungStorno.js'
import { anmeldungZuordnenProcedure } from './anmeldungZuordnen.js'
// Import Routes here - do not delete this line

export const anmeldungRouter = mergeRouters(
  anmeldungPublicCreateProcedure.router,
  anmeldungTeilnehmerStornoProcedure.router,
  anmeldungVerwaltungAblehnenProcedure.router,
  anmeldungVerwaltungAnnehmenProcedure.router,
  anmeldungVerwaltungStornoProcedure.router,
  anmeldungVerwaltungCreateProcedure.router,
  anmeldungVerwaltungPatchProcedure.router,
  anmeldungGliederungPatchProcedure.router,
  anmeldungCountProcedure.router,
  anmeldungListProcedure.router,
  anmeldungGetProcedure.router,
  anmeldungZuordnenProcedure.router
  // Add Routes here - do not delete this line
)
