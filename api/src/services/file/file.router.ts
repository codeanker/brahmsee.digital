/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { fileCreateProcedure } from './fileCreate'
import { fileGetUrlActionProcedure } from './fileGetUrl'
// Import Routes here - do not delete this line

export const fileRouter = mergeRouters(
  fileCreateProcedure.router,
  fileGetUrlActionProcedure.router,
  // Add Routes here - do not delete this line
)
