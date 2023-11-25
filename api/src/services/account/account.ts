import { protectedProcedure, router } from '../../trpc'

import { ZAccountActivateInputSchema, accountActivate } from './accountActivate'
import { ZAccountChangePasswordInputSchema, accountChangePassword } from './accountChangePassword'
import { ZAccountGliederungAdminCreateInputSchema, accountGliederungAdminCreate } from './accountGliederungAdminCreate'
import { ZAccountVerwaltungCreateInputSchema, accountVerwaltungCreate } from './accountVerwaltungCreate'

export const accountRouter = router({
  changePassword: protectedProcedure(['ADMIN', 'GLIEDERUNG_ADMIN'])
    .input(ZAccountChangePasswordInputSchema)
    .mutation(accountChangePassword),
  verwaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZAccountVerwaltungCreateInputSchema)
    .mutation(accountVerwaltungCreate),
  gliederungAdminCreate: protectedProcedure(['ADMIN'])
    .input(ZAccountGliederungAdminCreateInputSchema)
    .mutation(accountGliederungAdminCreate),
  activate: protectedProcedure(['ADMIN']).input(ZAccountActivateInputSchema).mutation(accountActivate),
})
