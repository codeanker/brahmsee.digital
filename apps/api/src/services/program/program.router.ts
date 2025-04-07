// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'
import { programSearchLocationProcedure, programSearchResponsiblesProcedure } from './program.autocomplete.js'
import { programCreateProcedure } from './program.create.js'
import { programListProcedure } from './program.list.js'

// Import Routes here - do not delete this line

export const programRouter = mergeRouters(
  programListProcedure,
  programCreateProcedure,
  programSearchLocationProcedure,
  programSearchResponsiblesProcedure
  // Add Routes here - do not delete this line
)
