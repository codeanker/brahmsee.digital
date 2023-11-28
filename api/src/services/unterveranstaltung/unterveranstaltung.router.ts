import { protectedProcedure, publicProcedure, router } from '../../trpc'

import {
  ZUnterveranstaltungGliederungCreateInputSchema,
  unterveranstaltungGliederungCreate,
} from './unterveranstaltungGliederungCreate'
import {
  ZUnterveranstaltungGliederungListInputSchema,
  unterveranstaltungGliederungList,
} from './unterveranstaltungGliederungList'
import {
  ZUnterveranstaltungGliederungPatchInputSchema,
  unterveranstaltungGliederungPatch,
} from './unterveranstaltungGliederungPatch'
import { ZUnterveranstaltungPublicGetInputSchema, unterveranstaltungPublicGet } from './unterveranstaltungPublicGet'
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
  publicGet: publicProcedure.input(ZUnterveranstaltungPublicGetInputSchema).query(unterveranstaltungPublicGet),
  gliederungCreate: protectedProcedure(['GLIEDERUNG_ADMIN'])
    .input(ZUnterveranstaltungGliederungCreateInputSchema)
    .mutation(unterveranstaltungGliederungCreate),
  gliederungList: protectedProcedure(['GLIEDERUNG_ADMIN'])
    .input(ZUnterveranstaltungGliederungListInputSchema)
    .query(unterveranstaltungGliederungList),
  gliederungPatch: protectedProcedure(['GLIEDERUNG_ADMIN'])
    .input(ZUnterveranstaltungGliederungPatchInputSchema)
    .mutation(unterveranstaltungGliederungPatch),
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
