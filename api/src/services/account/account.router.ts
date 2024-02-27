/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { accountActivateProcedure } from './accountActivate'
import { accountChangePasswordProcedure } from './accountChangePassword'
import { accountEmailConfirmProcedure } from './accountEmailConfirm'
import { accountEmailConfirmRequestProcedure } from './accountEmailConfirmRequest'
import { accountGliederungAdminCreateProcedure } from './accountGliederungAdminCreate'
import { accountPasswordResetProcedure } from './accountPasswordReset'
import { accountVerwaltungCreateProcedure } from './accountVerwaltungCreate'
import { accountVerwaltungGetProcedure } from './accountVerwaltungGet'
import { accountVerwaltungListProcedure } from './accountVerwaltungList'
import { accountVerwaltungPatchProcedure } from './accountVerwaltungPatch'
import {accountVerwaltungRemoveProcedure} from './accountVerwaltungRemove'
// Import Routes here - do not delete this line

export const accountRouter = mergeRouters(
  accountActivateProcedure.router,
  accountChangePasswordProcedure.router,
  accountGliederungAdminCreateProcedure.router,
  accountVerwaltungCreateProcedure.router,
  accountVerwaltungGetProcedure.router,
  accountVerwaltungListProcedure.router,
  accountVerwaltungPatchProcedure.router,
  accountEmailConfirmRequestProcedure.router,
  accountEmailConfirmProcedure.router,
  accountPasswordResetProcedure.router,
  accountVerwaltungRemoveProcedure.router
  // Add Routes here - do not delete this line
)
