import { router, protectedProcedure } from '../../trpc'

import { userAuthenticatedGet, ZUserAuthenticatedGetInputSchema } from './userAuthenticatedGet'
import { ZUserChangePasswordInputSchema, userChangePassword } from './userChangePassword'
import { userManagementCreate, ZUserManagementCreateInputSchema } from './userManagementCreate'
import { userManagementGet, ZUserManagementGetInputSchema } from './userManagementGet'
import { ZUserManagementListInputSchema, userManagementList } from './userManagementList'
import { ZUserManagementPatchInputSchema, userManagementPatch } from './userManagementPatch'
import { ZUserManagementRemoveInputSchema, userManagementRemove } from './userManagementRemove'
import { userRegistrationCreate, ZUserRegistrationCreateInputSchema } from './userRegistrationCreate'

export const userRouter = router({
  authenticatedGet: protectedProcedure([]).input(ZUserAuthenticatedGetInputSchema).query(userAuthenticatedGet),
  registrationCreate: protectedProcedure([]).input(ZUserRegistrationCreateInputSchema).mutation(userRegistrationCreate),
  managementCreate: protectedProcedure(['ADMIN'])
    .input(ZUserManagementCreateInputSchema)
    .mutation(userManagementCreate),
  managementGet: protectedProcedure(['ADMIN']).input(ZUserManagementGetInputSchema).query(userManagementGet),
  managementRemove: protectedProcedure(['ADMIN'])
    .input(ZUserManagementRemoveInputSchema)
    .mutation(userManagementRemove),
  managementPatch: protectedProcedure(['ADMIN']).input(ZUserManagementPatchInputSchema).mutation(userManagementPatch),
  managementList: protectedProcedure(['ADMIN']).input(ZUserManagementListInputSchema).query(userManagementList),
  changePassword: protectedProcedure(['ADMIN', 'GLIEDERUNG_ADMIN'])
    .input(ZUserChangePasswordInputSchema)
    .mutation(userChangePassword),
  // [additional routes]
})
