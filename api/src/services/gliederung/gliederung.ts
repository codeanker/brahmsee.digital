import { router, protectedProcedure } from '../../trpc'

import { gliederungVerwaltungCreate, ZGliederungVerwaltungCreateInputSchema } from './gliederungVerwaltungCreate'
import { ZGliederungVerwaltungGetInputSchema, gliederungVerwaltungGet } from './gliederungVerwaltungGet'
import { ZGliederungVerwaltungListInputSchema, gliederungVerwaltungList } from './gliederungVerwaltungList'

export const gliederungRouter = router({
  verwaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZGliederungVerwaltungCreateInputSchema)
    .mutation(gliederungVerwaltungCreate),
  verwaltungList: protectedProcedure(['ADMIN'])
    .input(ZGliederungVerwaltungListInputSchema)
    .query(gliederungVerwaltungList),
  // [additional routes]
  verwaltungGet: protectedProcedure(['ADMIN'])
    .input(ZGliederungVerwaltungGetInputSchema)
    .query(gliederungVerwaltungGet),
})
