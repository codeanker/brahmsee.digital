import { protectedProcedure, router } from '../../trpc'

import {
  ZVeranstaltungVerwaltungCreateInputSchema,
  veranstaltungVerwaltungCreate,
} from './veranstaltungVerwaltungCreate'
import { ZVeranstaltungVerwaltungGetInputSchema, veranstaltungVerwaltungGet } from './veranstaltungVerwaltungGet'
import { ZVeranstaltungenVerwaltungListInputSchema, veranstaltungenVerwaltungList } from './veranstaltungVerwaltungList'
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
