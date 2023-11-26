import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZUnterveranstaltungVerwaltungPatchInputSchema = z.strictObject({
  data: z.strictObject({
    unterveranstaltungId: z.number().int(),
    maxTeilnehmende: z.number().int().optional(),
    teilnahmegebuehr: z.number({ description: 'In Cent' }).int().optional(),
    meldebeginn: z.date().optional(),
    meldeschluss: z.date().optional(),
    beschreibung: z.string().optional(),
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
