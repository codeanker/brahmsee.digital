import { protectedProcedure, publicProcedure, router } from '../../trpc'

import { ZAnmeldungGliederungStornoInputSchema, anmeldungGliederungStorno } from './anmeldungGliederungStorno'
import { ZAnmeldungPublicCreateInputSchema, anmeldungPublicCreate } from './anmeldungPublicCreate'
import { ZAnmeldungTeilnehmerStornoInputSchema, anmeldungTeilnehmerStorno } from './anmeldungTeilnehmerStorno'
import { ZAnmeldungVerwaltungAblehnenInputSchema, anmeldungVerwaltungAblehnen } from './anmeldungVerwaltungAblehnen'
import { ZAnmeldungVerwaltungAnnehmenInputSchema, anmeldungVerwaltungAnnehmen } from './anmeldungVerwaltungAnnehmen'
import { ZAnmeldungVerwaltungStornoInputSchema, anmeldungVerwaltungStorno } from './anmeldungVerwaltungStorno'

export const anmeldungRouter = router({
  publicCreate: publicProcedure.input(ZAnmeldungPublicCreateInputSchema).mutation(anmeldungPublicCreate),
  verwaltungAnnehmen: protectedProcedure(['ADMIN'])
    .input(ZAnmeldungVerwaltungAnnehmenInputSchema)
    .mutation(anmeldungVerwaltungAnnehmen),
  verwaltungAblehnen: protectedProcedure(['ADMIN'])
    .input(ZAnmeldungVerwaltungAblehnenInputSchema)
    .mutation(anmeldungVerwaltungAblehnen),
  verwaltungStorno: protectedProcedure(['ADMIN'])
    .input(ZAnmeldungVerwaltungStornoInputSchema)
    .mutation(anmeldungVerwaltungStorno),
  teilnehmerStorno: protectedProcedure(['ADMIN'])
    .input(ZAnmeldungTeilnehmerStornoInputSchema)
    .mutation(anmeldungTeilnehmerStorno),
  gliederungStorno: protectedProcedure(['ADMIN', 'GLIEDERUNG_ADMIN'])
    .input(ZAnmeldungGliederungStornoInputSchema)
    .mutation(anmeldungGliederungStorno),
})
