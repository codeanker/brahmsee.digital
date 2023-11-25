import { protectedProcedure, router } from '../../trpc'

import {
  ZVeranstaltungVerwaltungCreateInputSchema,
  veranstaltungVerwaltungCreate,
} from './veranstaltungVerwaltungCreate'
import { ZVeranstaltungVerwaltungPatchInputSchema, veranstaltungVerwaltungPatch } from './veranstaltungVerwaltungPatch'

export const veranstaltungRouter = router({
  verwaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZVeranstaltungVerwaltungCreateInputSchema)
    .mutation(veranstaltungVerwaltungCreate),
  verwaltungPatch: protectedProcedure(['ADMIN'])
    .input(ZVeranstaltungVerwaltungPatchInputSchema)
    .mutation(veranstaltungVerwaltungPatch),
  // TODO: add your API methods here
})
