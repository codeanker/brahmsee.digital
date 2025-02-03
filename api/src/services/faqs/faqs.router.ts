// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'
import { faqCreateProcedure } from './faqCreateProcedure.js'
import { faqDeleteProcedure } from './faqDeleteProcecure.js'
import { faqCategorySearchProcedure, faqListProcedure } from './faqListProcedure.js'
import { faqUpdateProcedure } from './faqUpdateProcedure.js'

// Import Routes here - do not delete this line

export const faqsRouter = mergeRouters(
  faqListProcedure.router,
  faqCategorySearchProcedure.router,
  faqCreateProcedure.router,
  faqUpdateProcedure.router,
  faqDeleteProcedure.router
  // Add Routes here - do not delete this line
)
