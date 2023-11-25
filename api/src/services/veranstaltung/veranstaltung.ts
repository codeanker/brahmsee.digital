import { protectedProcedure, router } from '../../trpc'

import { ZVeranstaltungCreateInputSchema, veranstaltungCreate } from './veranstaltungCreate'
import { ZVeranstaltungVerwaltungGetInputSchema, veranstaltungVerwaltungGet } from './veranstaltungGet'

export const veranstaltungRouter = router({
  veranstaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZVeranstaltungCreateInputSchema)
    .mutation(veranstaltungCreate),
  // TODO: add your API methods here
  verwaltungGet: protectedProcedure(['ADMIN'])
    .input(ZVeranstaltungVerwaltungGetInputSchema)
    .query(veranstaltungVerwaltungGet),
})
