import { protectedProcedure, publicProcedure, router } from '../../trpc'

import { ZAnmeldungGliederungStornoInputSchema, anmeldungGliederungStorno } from './anmeldungGliederungStorno'
import { ZAnmeldungPublicCreateInputSchema, anmeldungPublicCreate } from './anmeldungPublicCreate'
import { ZAnmeldungTeilnehmerStornoInputSchema, anmeldungTeilnehmerStorno } from './anmeldungTeilnehmerStorno'
import { ZAnmeldungVerwaltungAblehnenInputSchema, anmeldungVerwaltungAblehnen } from './anmeldungVerwaltungAblehnen'
import { ZAnmeldungVerwaltungAnnehmenInputSchema, anmeldungVerwaltungAnnehmen } from './anmeldungVerwaltungAnnehmen'
import { ZAnmeldungVerwaltungStornoInputSchema, anmeldungVerwaltungStorno } from './anmeldungVerwaltungStorno'

export const anmeldungRouter = router({
  anmeldungPublicCreate: publicProcedure.input(ZAnmeldungPublicCreateInputSchema).mutation(anmeldungPublicCreate),
  anmeldungVerwaltungAnnehmen: protectedProcedure(['ADMIN'])
    .input(ZAnmeldungVerwaltungAnnehmenInputSchema)
    .mutation(anmeldungVerwaltungAnnehmen),
  anmeldungVerwaltungAblehnen: protectedProcedure(['ADMIN'])
    .input(ZAnmeldungVerwaltungAblehnenInputSchema)
    .mutation(anmeldungVerwaltungAblehnen),
  anmeldungVerwaltungStorno: protectedProcedure(['ADMIN'])
    .input(ZAnmeldungVerwaltungStornoInputSchema)
    .mutation(anmeldungVerwaltungStorno),
  anmeldungTeilnehmerStorno: protectedProcedure(['ADMIN'])
    .input(ZAnmeldungTeilnehmerStornoInputSchema)
    .mutation(anmeldungTeilnehmerStorno),
  anmeldungGliederungStorno: protectedProcedure(['ADMIN', 'GLIEDERUNG_ADMIN'])
    .input(ZAnmeldungGliederungStornoInputSchema)
    .mutation(anmeldungGliederungStorno),
})
