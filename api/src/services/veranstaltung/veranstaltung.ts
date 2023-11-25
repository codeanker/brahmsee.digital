import { protectedProcedure, router } from '../../trpc'

import { ZVeranstaltungCreateInputSchema, veranstaltungCreate } from './veranstaltungCreate'

export const veranstaltungRouter = router({
  veranstaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZVeranstaltungCreateInputSchema)
    .mutation(veranstaltungCreate),
  // TODO: add your API methods here
})
