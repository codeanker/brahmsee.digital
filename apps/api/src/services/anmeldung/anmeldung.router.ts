// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'
import { anmeldungAccessTokenValidateProcedure } from './anmeldungAccessTokenValidate.js'
import { anmeldungFotoUploadProcedure } from './anmeldungFotoUpload.js'

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
  anmeldungPublicCreateProcedure,
  anmeldungTeilnehmerStornoProcedure,
  anmeldungVerwaltungAblehnenProcedure,
  anmeldungVerwaltungAnnehmenProcedure,
  anmeldungVerwaltungStornoProcedure,
  anmeldungVerwaltungCreateProcedure,
  anmeldungVerwaltungPatchProcedure,
  anmeldungGliederungPatchProcedure,
  anmeldungCountProcedure,
  anmeldungListProcedure,
  anmeldungGetProcedure,
  anmeldungZuordnenProcedure,
  anmeldungAccessTokenValidateProcedure,
  anmeldungFotoUploadProcedure
  // Add Routes here - do not delete this line
)
