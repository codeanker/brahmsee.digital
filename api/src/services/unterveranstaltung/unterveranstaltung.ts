import { protectedProcedure, publicProcedure, router } from '../../trpc'

import { ZUnterveranstaltungGetInputSchema, unterveranstaltungGet } from './unterveranstaltungGet'
import {
  ZUnterveranstaltungGliederungCreateInputSchema,
  unterveranstaltungGliederungCreate,
} from './unterveranstaltungGliederungCreate'
import {
  ZUnterveranstaltungGliederungListInputSchema,
  unterveranstaltungGliederungList,
} from './unterveranstaltungGliederungList'
import {
  ZUnterveranstaltungVerwaltungCreateInputSchema,
  unterveranstaltungVerwaltungCreate,
} from './unterveranstaltungVerwaltungCreate'
import {
  ZUnterveranstaltungVerwaltungListInputSchema,
  unterveranstaltungVerwaltungList,
} from './unterveranstaltungVerwaltungList'
import {
  ZUnterveranstaltungVerwaltungPatchInputSchema,
  unterveranstaltungVerwaltungPatch,
} from './unterveranstaltungVerwaltungPatch'

export const unterveranstaltungRouter = router({
  get: publicProcedure.input(ZUnterveranstaltungGetInputSchema).query(unterveranstaltungGet),
  gliederungCreate: protectedProcedure(['GLIEDERUNG_ADMIN'])
    .input(ZUnterveranstaltungGliederungCreateInputSchema)
    .mutation(unterveranstaltungGliederungCreate),
  gliederungList: protectedProcedure(['GLIEDERUNG_ADMIN'])
    .input(ZUnterveranstaltungGliederungListInputSchema)
    .query(unterveranstaltungGliederungList),
  verwaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZUnterveranstaltungVerwaltungCreateInputSchema)
    .mutation(unterveranstaltungVerwaltungCreate),
  verwaltungList: protectedProcedure(['ADMIN'])
    .input(ZUnterveranstaltungVerwaltungListInputSchema)
    .query(unterveranstaltungVerwaltungList),
  verwaltungPatch: protectedProcedure(['ADMIN'])
    .input(ZUnterveranstaltungVerwaltungPatchInputSchema)
    .mutation(unterveranstaltungVerwaltungPatch),
})
