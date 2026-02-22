// Prettier ignored is because this file is generated
import { mergeRouters } from '../../trpc.js'
import { programSearchLocationProcedure, programSearchResponsiblesProcedure } from './program.autocomplete.js'
import { programCreateProcedure } from './program.create.js'
import { programDeleteProcedure } from './program.delete.js'
import { programEditProcedure } from './program.edit.js'
import { programGetProcedure } from './program.get.js'
import { programListProcedure } from './program.list.js'

// Import Routes here - do not delete this line

export const programRouter = mergeRouters(
  // Queries
  programListProcedure,
  programGetProcedure,
  programSearchLocationProcedure,
  programSearchResponsiblesProcedure,

  // Mutations
  programCreateProcedure,
  programEditProcedure,
  programDeleteProcedure
  // Add Routes here - do not delete this line
)
