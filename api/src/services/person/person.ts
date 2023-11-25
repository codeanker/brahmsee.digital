import { router, protectedProcedure } from '../../trpc'

import { personAuthenticatedGet, ZPersonAuthenticatedGetInputSchema } from './personAuthenticatedGet'
import { personManagementCreate, ZPersonManagementCreateInputSchema } from './personManagementCreate'
import { personManagementGet, ZPersonManagementGetInputSchema } from './personManagementGet'
import { ZPersonManagementListInputSchema, personManagementList } from './personManagementList'
import { ZPersonManagementPatchInputSchema, personManagementPatch } from './personManagementPatch'
import { ZPersonManagementRemoveInputSchema, personManagementRemove } from './personManagementRemove'

export const personRouter = router({
  authenticatedGet: protectedProcedure([]).input(ZPersonAuthenticatedGetInputSchema).query(personAuthenticatedGet),
  managementCreate: protectedProcedure(['ADMIN'])
    .input(ZPersonManagementCreateInputSchema)
    .mutation(personManagementCreate),
  managementGet: protectedProcedure(['ADMIN']).input(ZPersonManagementGetInputSchema).query(personManagementGet),
  managementRemove: protectedProcedure(['ADMIN'])
    .input(ZPersonManagementRemoveInputSchema)
    .mutation(personManagementRemove),
  managementPatch: protectedProcedure(['ADMIN'])
    .input(ZPersonManagementPatchInputSchema)
    .mutation(personManagementPatch),
  managementList: protectedProcedure(['ADMIN']).input(ZPersonManagementListInputSchema).query(personManagementList),
  // [additional routes]
})
