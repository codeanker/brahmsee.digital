import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungAnnehmenInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungAnnehmenInputSchema = z.infer<typeof ZAnmeldungAnnehmenInputSchema>

type AnmeldungAnnehmenOptions = AuthenticatedContext & {
  input: TAnmeldungAnnehmenInputSchema
}

export async function anmeldungAnnehmen(options: AnmeldungAnnehmenOptions) {
  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
    },
    data: {
      status: 'ANGENOMMEN',
    },
  })
}
