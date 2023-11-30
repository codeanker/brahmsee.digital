import { mergeRouters } from '../../trpc'

import { anmeldungPublicCreateProcedure } from './anmeldungPublicCreate'
import { anmeldungTeilnehmerStornoProcedure } from './anmeldungTeilnehmerStorno'
import { anmeldungVerwaltungAblehnenProcedure } from './anmeldungVerwaltungAblehnen'
import { anmeldungVerwaltungAnnehmenProcedure } from './anmeldungVerwaltungAnnehmen'
import { anmeldungVerwaltungStornoProcedure } from './anmeldungVerwaltungStorno'

export const anmeldungRouter = mergeRouters(
  anmeldungPublicCreateProcedure.router,
  anmeldungTeilnehmerStornoProcedure.router,
  anmeldungVerwaltungAblehnenProcedure.router,
  anmeldungVerwaltungAnnehmenProcedure.router,
  anmeldungVerwaltungStornoProcedure.router
)
