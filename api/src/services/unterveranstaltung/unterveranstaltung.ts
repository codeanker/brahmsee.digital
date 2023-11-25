import { protectedProcedure, router } from '../../trpc'

import {
  ZUnterveranstaltungVerwaltungCreateInputSchema,
  unterveranstaltungVerwaltungCreate,
} from './unterveranstaltungVerwaltungCreate'

export const unterveranstaltungRouter = router({
  // TODO: add your API methods here
  verwaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZUnterveranstaltungVerwaltungCreateInputSchema)
    .mutation(unterveranstaltungVerwaltungCreate),
})
