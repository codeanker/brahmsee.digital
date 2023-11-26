import z from 'zod'

import { getGliederungRequireAdmin } from '../../helpers/getGliederungRequireAdmin'
import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZUnterveranstaltungGliederungPatchInputSchema = z.strictObject({
  data: z.strictObject({
    unterveranstaltungId: z.number().int(),
    maxTeilnehmende: z.number().int(),
    teilnahmegebuehr: z.number({ description: 'In Cent' }).int(),
    meldebeginn: z.date(),
    meldeschluss: z.date(),
    beschreibung: z.string().optional(),
  }),
})

export type TUnterveranstaltungGliederungPatchInputSchema = z.infer<
  typeof ZUnterveranstaltungGliederungPatchInputSchema
>

type UnterveranstaltungGliederungPatchOptions = AuthenticatedContext & {
  input: TUnterveranstaltungGliederungPatchInputSchema
}

export async function unterveranstaltungGliederungPatch(options: UnterveranstaltungGliederungPatchOptions) {
  const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
  return prisma.unterveranstaltung.update({
    where: {
      id: options.input.data.unterveranstaltungId,
      gliederungId: gliederung.id,
    },
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
