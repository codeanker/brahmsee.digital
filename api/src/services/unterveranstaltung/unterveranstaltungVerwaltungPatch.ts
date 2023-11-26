import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZUnterveranstaltungVerwaltungPatchInputSchema = z.strictObject({
  data: z.strictObject({
    unterveranstaltungId: z.number().int(),
    maxTeilnehmende: z.number().int(),
    teilnahmegebuehr: z.number({ description: 'In Cent' }).int(),
    meldebeginn: z.date(),
    meldeschluss: z.date(),
    beschreibung: z.string(),
  }),
})

export type TUnterveranstaltungVerwaltungPatchInputSchema = z.infer<
  typeof ZUnterveranstaltungVerwaltungPatchInputSchema
>

type UnterveranstaltungVerwaltungPatchOptions = AuthenticatedContext & {
  input: TUnterveranstaltungVerwaltungPatchInputSchema
}

export async function unterveranstaltungVerwaltungPatch(options: UnterveranstaltungVerwaltungPatchOptions) {
  return prisma.unterveranstaltung.update({
    where: {
      id: options.input.data.unterveranstaltungId,
    },
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
