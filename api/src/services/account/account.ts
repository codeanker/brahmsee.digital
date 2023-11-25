import { protectedProcedure, router } from '../../trpc'

import { ZAccountChangePasswordInputSchema, accountChangePassword } from './accountChangePassword'

export const personRouter = router({
  changePassword: protectedProcedure(['ADMIN', 'GLIEDERUNG_ADMIN'])
    .input(ZAccountChangePasswordInputSchema)
    .mutation(accountChangePassword),
})
