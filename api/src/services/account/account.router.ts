import { mergeRouters } from '../../trpc'

import { accountActivateProcedure } from './accountActivate'
import { accountChangePasswordProcedure } from './accountChangePassword'
import { accountGliederungAdminCreateProcedure } from './accountGliederungAdminCreate'
import { accountVerwaltungCreateProcedure } from './accountVerwaltungCreate'

export const accountRouter = mergeRouters(
  accountActivateProcedure.router,
  accountChangePasswordProcedure.router,
  accountGliederungAdminCreateProcedure.router,
  accountVerwaltungCreateProcedure.router
)
