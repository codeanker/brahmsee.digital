// Prettier ignored is because this file is generated
import { mergeRouters } from "../../trpc.js"

import { accountActivateProcedure } from "./accountActivate.js"
import { accountChangePasswordProcedure } from "./accountChangePassword.js"
import { accountEmailConfirmProcedure } from "./accountEmailConfirm.js"
import { accountEmailConfirmRequestProcedure } from "./accountEmailConfirmRequest.js"
import { accountGliederungAdminCreateProcedure } from "./accountGliederungAdminCreate.js"
import { accountPasswordResetProcedure } from "./accountPasswordReset.js"
import { accountVerwaltungCreateProcedure } from "./accountVerwaltungCreate.js"
import { accountVerwaltungGetProcedure } from "./accountVerwaltungGet.js"
import { accountVerwaltungCountProcedure, accountVerwaltungListProcedure } from "./accountVerwaltungList.js"
import { accountVerwaltungPatchProcedure } from "./accountVerwaltungPatch.js"
import { accountVerwaltungRemoveProcedure } from "./accountVerwaltungRemove.js"
// Import Routes here - do not delete this line

export const accountRouter = mergeRouters(
  accountActivateProcedure.router,
  accountChangePasswordProcedure.router,
  accountGliederungAdminCreateProcedure.router,
  accountVerwaltungCreateProcedure.router,
  accountVerwaltungGetProcedure.router,
  accountVerwaltungListProcedure.router,
  accountVerwaltungCountProcedure.router,
  accountVerwaltungPatchProcedure.router,
  accountEmailConfirmRequestProcedure.router,
  accountEmailConfirmProcedure.router,
  accountPasswordResetProcedure.router,
  accountVerwaltungRemoveProcedure.router
  // Add Routes here - do not delete this line
)
