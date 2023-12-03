/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { accountActivateProcedure } from './accountActivate'
import { accountChangePasswordProcedure } from './accountChangePassword'
import { accountGliederungAdminCreateProcedure } from './accountGliederungAdminCreate'
import { accountVerwaltungCreateProcedure } from './accountVerwaltungCreate'
// Import Routes here - do not delete this line

export const accountRouter = mergeRouters(
  accountActivateProcedure.router,
  accountChangePasswordProcedure.router,
  accountGliederungAdminCreateProcedure.router,
  accountVerwaltungCreateProcedure.router,
  // Add Routes here - do not delete this line
)
