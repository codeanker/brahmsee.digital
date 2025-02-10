// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'
import { anmeldungPublicFotoUploadProcedure } from './anmeldungPublicFotoUpload.js'

import { fileCreateProcedure } from './fileCreate.js'
import { fileGetUrlActionProcedure } from './fileGetUrl.js'
// Import Routes here - do not delete this line

export const fileRouter = mergeRouters(
  fileCreateProcedure.router,
  fileGetUrlActionProcedure.router,
  anmeldungPublicFotoUploadProcedure.router
  // Add Routes here - do not delete this line
)
