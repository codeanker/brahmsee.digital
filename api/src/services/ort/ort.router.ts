import { mergeRouters } from '../../trpc'

import { ortVerwaltungCreateProcedure } from './ortVerwaltungCreate'
import { ortVerwaltungGetProcedure } from './ortVerwaltungGet'
import { ortVerwaltungListProcedure } from './ortVerwaltungList'

export const ortRouter = mergeRouters(
  ortVerwaltungCreateProcedure.router,
  ortVerwaltungGetProcedure.router,
  ortVerwaltungListProcedure.router
)
