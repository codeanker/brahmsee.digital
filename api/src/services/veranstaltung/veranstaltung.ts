import { protectedProcedure, router } from '../../trpc'

import {
  ZVeranstaltungVerwaltungCreateInputSchema,
  veranstaltungVerwaltungCreate,
} from './veranstaltungVerwaltungCreate'

export const veranstaltungRouter = router({
  verwaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZVeranstaltungVerwaltungCreateInputSchema)
    .mutation(veranstaltungVerwaltungCreate),
  // TODO: add your API methods here
})
