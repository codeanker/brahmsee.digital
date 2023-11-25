import { protectedProcedure, router } from '../../trpc'

import {
  ZUnterveranstaltungGliederungCreateInputSchema,
  unterveranstaltungGliederungCreate,
} from './unterveranstaltungGliederungCreate'
import {
  ZUnterveranstaltungVerwaltungCreateInputSchema,
  unterveranstaltungVerwaltungCreate,
} from './unterveranstaltungVerwaltungCreate'
import {
  ZUnterveranstaltungVerwaltungPatchInputSchema,
  unterveranstaltungVerwaltungPatch,
} from './unterveranstaltungVerwaltungPatch'

export const unterveranstaltungRouter = router({
  verwaltungCreate: protectedProcedure(['ADMIN'])
    .input(ZUnterveranstaltungVerwaltungCreateInputSchema)
    .mutation(unterveranstaltungVerwaltungCreate),
  verwaltungPatch: protectedProcedure(['ADMIN'])
    .input(ZUnterveranstaltungVerwaltungPatchInputSchema)
    .mutation(unterveranstaltungVerwaltungPatch),
  gliederungCreate: protectedProcedure(['GLIEDERUNG_ADMIN'])
    .input(ZUnterveranstaltungGliederungCreateInputSchema)
    .mutation(unterveranstaltungGliederungCreate),
})
