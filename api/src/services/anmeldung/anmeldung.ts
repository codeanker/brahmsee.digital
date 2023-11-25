import { protectedProcedure, publicProcedure, router } from '../../trpc'

import { ZAnmeldungAblehnenInputSchema, anmeldungAblehnen } from './anmeldungAblehnen'
import { ZAnmeldungAnnehmenInputSchema, anmeldungAnnehmen } from './anmeldungAnnehmen'
import { ZAnmeldungCreateInputSchema, anmeldungCreate } from './anmeldungCreate'
import { ZAnmeldungStornoInputSchema, anmeldungStorno } from './anmeldungStorno'
import {
  ZAnmeldungStornoGliederungsadminInputSchema,
  anmeldungStornoGliederungsadmin,
} from './anmeldungStornoGliederungsadmin'
import { ZAnmeldungStornoSelfInputSchema, anmeldungStornoSelf } from './anmeldungStornoSelbst'

export const anmeldungRouter = router({
  anmeldungCreate: publicProcedure.input(ZAnmeldungCreateInputSchema).mutation(anmeldungCreate),
  anmeldungAnnehmen: protectedProcedure(['ADMIN']).input(ZAnmeldungAnnehmenInputSchema).mutation(anmeldungAnnehmen),
  anmeldungAblehnen: protectedProcedure(['ADMIN']).input(ZAnmeldungAblehnenInputSchema).mutation(anmeldungAblehnen),
  anmeldungStorno: protectedProcedure(['ADMIN']).input(ZAnmeldungStornoInputSchema).mutation(anmeldungStorno),
  anmeldungStornoSelf: protectedProcedure(['ADMIN'])
    .input(ZAnmeldungStornoSelfInputSchema)
    .mutation(anmeldungStornoSelf),
  anmeldungStornoGliederungsadmin: protectedProcedure(['ADMIN', 'GLIEDERUNG_ADMIN'])
    .input(ZAnmeldungStornoGliederungsadminInputSchema)
    .mutation(anmeldungStornoGliederungsadmin),
})
