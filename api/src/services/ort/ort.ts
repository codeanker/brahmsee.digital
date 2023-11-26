import { protectedProcedure, router } from '../../trpc'

import { ZOrtVerwaltungCreateInputSchema, ortVerwaltungCreate } from './ortVerwaltungCreate'
import { ZOrtVerwaltungGetInputSchema, ortVerwaltungGet } from './ortVerwaltungGet'
import { ZOrtVerwaltungListInputSchema, ortVerwaltungList } from './ortVerwaltungList'

export const ortRouter = router({
  verwaltungCreate: protectedProcedure(['ADMIN']).input(ZOrtVerwaltungCreateInputSchema).mutation(ortVerwaltungCreate),
  verwaltungGet: protectedProcedure(['ADMIN']).input(ZOrtVerwaltungGetInputSchema).query(ortVerwaltungGet),
  verwaltungList: protectedProcedure(['ADMIN']).input(ZOrtVerwaltungListInputSchema).query(ortVerwaltungList),
  // TODO: add your API methods here
})
