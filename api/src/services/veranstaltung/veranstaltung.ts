import { protectedProcedure, router } from '../../trpc'

import { ZVeranstaltungVerwaltungGetInputSchema, veranstaltungVerwaltungGet } from './veranstaltungGet'
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
  verwaltungGet: protectedProcedure(['ADMIN'])
    .input(ZVeranstaltungVerwaltungGetInputSchema)
    .query(veranstaltungVerwaltungGet),
})
