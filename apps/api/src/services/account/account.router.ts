// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'

import { accountActivateProcedure } from './accountActivate.js'
import { accountChangePasswordProcedure } from './accountChangePassword.js'
import { accountEmailConfirmProcedure } from './accountEmailConfirm.js'
import { accountEmailConfirmRequestProcedure } from './accountEmailConfirmRequest.js'
import { accountGliederungCreateProcedure } from './accountGliederungCreate.js'
import { accountPasswordResetProcedure } from './accountPasswordReset.js'
import { accountPasswordResetRequestProcedure } from './accountPasswordResetRequest.js'
import { accountPasswordResetValidateProcedure } from './accountPasswordResetToken.js'
import { accountTeilnehmerCreateProcedure } from './accountTeilnehmerCreate.js'
import { accountVerwaltungCreateProcedure } from './accountVerwaltungCreate.js'
import { accountVerwaltungGetProcedure } from './accountVerwaltungGet.js'
import { accountVerwaltungListProcedure } from './accountVerwaltungList.js'
import { accountVerwaltungPatchProcedure } from './accountVerwaltungPatch.js'
import { accountVerwaltungRemoveProcedure } from './accountVerwaltungRemove.js'
// Import Routes here - do not delete this line

export const accountRouter = mergeRouters(
  accountActivateProcedure,
  accountChangePasswordProcedure,
  accountVerwaltungCreateProcedure,
  accountVerwaltungGetProcedure,
  accountVerwaltungListProcedure,
  accountVerwaltungPatchProcedure,
  accountEmailConfirmRequestProcedure,
  accountEmailConfirmProcedure,
  accountPasswordResetRequestProcedure,
  accountPasswordResetValidateProcedure,
  accountPasswordResetProcedure,
  accountVerwaltungRemoveProcedure,
  accountTeilnehmerCreateProcedure,
  accountGliederungCreateProcedure,
  // Add Routes here - do not delete this line
)
