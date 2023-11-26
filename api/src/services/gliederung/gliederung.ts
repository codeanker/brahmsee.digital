import { router, protectedProcedure, publicProcedure } from '../../trpc'

import { gliederungPublicGet, ZGliederungPublicGetInputSchema } from './gliederungPublicGet'
import { gliederungVerwaltungCreate, ZGliederungVerwaltungCreateInputSchema } from './gliederungVerwaltungCreate'
import { ZGliederungVerwaltungGetInputSchema, gliederungVerwaltungGet } from './gliederungVerwaltungGet'
import { ZGliederungVerwaltungListInputSchema, gliederungVerwaltungList } from './gliederungVerwaltungList'

export const gliederungRouter = router({
  publicGet: publicProcedure.input(ZGliederungPublicGetInputSchema).query(gliederungPublicGet),
  verwaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZGliederungVerwaltungCreateInputSchema)
    .mutation(gliederungVerwaltungCreate),
  verwaltungGet: protectedProcedure(['ADMIN'])
    .input(ZGliederungVerwaltungGetInputSchema)
    .query(gliederungVerwaltungGet),
  verwaltungList: protectedProcedure(['ADMIN'])
    .input(ZGliederungVerwaltungListInputSchema)
    .query(gliederungVerwaltungList),
})
