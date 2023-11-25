import { protectedProcedure, router } from '../../trpc'

import { ZUnterveranstaltungCreateInputSchema, unterveranstaltungCreate } from './unterveranstaltungCreate'

export const unterveranstaltungRouter = router({
  // TODO: add your API methods here
  unterveranstaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZUnterveranstaltungCreateInputSchema)
    .mutation(unterveranstaltungCreate),
})
