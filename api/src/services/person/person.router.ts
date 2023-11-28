import { router, protectedProcedure } from '../../trpc'

import { personAuthenticatedGet, ZPersonAuthenticatedGetInputSchema } from './personAuthenticatedGet'
import { personVerwaltungCreate, ZPersonVerwaltungCreateInputSchema } from './personVerwaltungCreate'
import { personVerwaltungGet, ZPersonVerwaltungGetInputSchema } from './personVerwaltungGet'
import { ZPersonVerwaltungListInputSchema, personVerwaltungList } from './personVerwaltungList'
import { ZPersonVerwaltungPatchInputSchema, personVerwaltungPatch } from './personVerwaltungPatch'
import { ZPersonVerwaltungRemoveInputSchema, personVerwaltungRemove } from './personVerwaltungRemove'

export const personRouter = router({
  authenticatedGet: protectedProcedure([]).input(ZPersonAuthenticatedGetInputSchema).query(personAuthenticatedGet),
  verwaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZPersonVerwaltungCreateInputSchema)
    .mutation(personVerwaltungCreate),
  verwaltungGet: protectedProcedure(['ADMIN']).input(ZPersonVerwaltungGetInputSchema).query(personVerwaltungGet),
  verwaltungRemove: protectedProcedure(['ADMIN'])
    .input(ZPersonVerwaltungRemoveInputSchema)
    .mutation(personVerwaltungRemove),
  verwaltungPatch: protectedProcedure(['ADMIN'])
    .input(ZPersonVerwaltungPatchInputSchema)
    .mutation(personVerwaltungPatch),
  verwaltungList: protectedProcedure(['ADMIN']).input(ZPersonVerwaltungListInputSchema).query(personVerwaltungList),
  // [additional routes]
})
