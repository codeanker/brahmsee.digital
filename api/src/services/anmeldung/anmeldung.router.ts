import { mergeRouters } from '../../trpc'

import { anmeldungGliederungAblehnenProcedure } from './anmeldungGliederungAblehnen'
import { anmeldungGliederungAnnehmenProcedure } from './anmeldungGliederungAnnehmen'
import { anmeldungGliederungStornoProcedure } from './anmeldungGliederungStorno'
import { anmeldungPublicCreateProcedure } from './anmeldungPublicCreate'
import { anmeldungTeilnehmerStornoProcedure } from './anmeldungTeilnehmerStorno'
import { anmeldungVerwaltungAblehnenProcedure } from './anmeldungVerwaltungAblehnen'
import { anmeldungVerwaltungAnnehmenProcedure } from './anmeldungVerwaltungAnnehmen'
import { anmeldungVerwaltungStornoProcedure } from './anmeldungVerwaltungStorno'

export const anmeldungRouter = mergeRouters(
  anmeldungGliederungAblehnenProcedure.router,
  anmeldungGliederungAnnehmenProcedure.router,
  anmeldungGliederungStornoProcedure.router,
  anmeldungPublicCreateProcedure.router,
  anmeldungTeilnehmerStornoProcedure.router,
  anmeldungVerwaltungAblehnenProcedure.router,
  anmeldungVerwaltungAnnehmenProcedure.router,
  anmeldungVerwaltungStornoProcedure.router
)
