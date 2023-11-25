import { publicProcedure, router } from '../../trpc'

import { ZAnmeldungCreateInputSchema, anmeldungCreate } from './anmeldungCreate'

export const anmeldungRouter = router({
  anmeldungCreate: publicProcedure.input(ZAnmeldungCreateInputSchema).mutation(anmeldungCreate),
})
