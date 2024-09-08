/* eslint-disable prettier/prettier */ // Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc'

import { addressFindActionProcedure } from './addressFindAddress'
// Import Routes here - do not delete this line

export const addressRouter = mergeRouters(
  addressFindActionProcedure.router,
  // Add Routes here - do not delete this line
)
