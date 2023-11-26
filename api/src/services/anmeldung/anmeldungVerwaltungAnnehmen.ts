import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungVerwaltungAnnehmenInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungVerwaltungAnnehmenInputSchema = z.infer<typeof ZAnmeldungVerwaltungAnnehmenInputSchema>

type AnmeldungVerwaltungAnnehmenOptions = AuthenticatedContext & {
  input: TAnmeldungVerwaltungAnnehmenInputSchema
}

export async function anmeldungVerwaltungAnnehmen(options: AnmeldungVerwaltungAnnehmenOptions) {
  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
    },
    data: {
      status: 'ANGENOMMEN',
    },
  })
}
