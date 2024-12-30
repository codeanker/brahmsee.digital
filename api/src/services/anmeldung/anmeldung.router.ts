// Prettier ignored is because this file is generated
import { mergeRouters } from "../../trpc.js"

import { anmeldungGliederungGetProcedure } from "./anmeldungGliederungGet.js"
import { anmeldungGliederungCountProcedure, anmeldungGliederungdListProcedure } from "./anmeldungGliederungList.js"
import { anmeldungGliederungPatchProcedure } from "./anmeldungGliederungPatch.js"
import { anmeldungPublicCreateProcedure } from "./anmeldungPublicCreate.js"
import { anmeldungTeilnehmerStornoProcedure } from "./anmeldungTeilnehmerStorno.js"
import { anmeldungVerwaltungAblehnenProcedure } from "./anmeldungVerwaltungAblehnen.js"
import { anmeldungVerwaltungAnnehmenProcedure } from "./anmeldungVerwaltungAnnehmen.js"
import { anmeldungVerwaltungCreateProcedure } from "./anmeldungVerwaltungCreate.js"
import { anmeldungVerwaltungGetProcedure } from "./anmeldungVerwaltungGet.js"
import { anmeldungVerwaltungCountProcedure, anmeldungVerwaltungListProcedure } from "./anmeldungVerwaltungList.js"
import { anmeldungVerwaltungPatchProcedure } from "./anmeldungVerwaltungPatch.js"
import { anmeldungVerwaltungStornoProcedure } from "./anmeldungVerwaltungStorno.js"
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
