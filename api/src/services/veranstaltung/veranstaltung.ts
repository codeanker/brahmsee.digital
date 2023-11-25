import { protectedProcedure, router } from '../../trpc'

import { ZVeranstaltungVerwaltungGetInputSchema, veranstaltungVerwaltungGet } from './veranstaltungGet'
import { ZVeranstaltungenVerwaltungListInputSchema, veranstaltungenVerwaltungList } from './veranstaltungList'
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
  verwaltungGet: protectedProcedure(['ADMIN'])
    .input(ZVeranstaltungVerwaltungGetInputSchema)
    .query(veranstaltungVerwaltungGet),
  verwaltungList: protectedProcedure(['ADMIN'])
    .input(ZVeranstaltungenVerwaltungListInputSchema)
    .query(veranstaltungenVerwaltungList),
})
