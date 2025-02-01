// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'
import { faqListProcedure } from './faqListProcedure.js'

// Import Routes here - do not delete this line

export const faqsRouter = mergeRouters(
  faqListProcedure.router
  // Add Routes here - do not delete this line
)
