import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungStornoInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungStornoInputSchema = z.infer<typeof ZAnmeldungStornoInputSchema>

type AnmeldungStornoOptions = AuthenticatedContext & {
  input: TAnmeldungStornoInputSchema
}

export async function anmeldungStorno(options: AnmeldungStornoOptions) {
  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
    },
    data: {
      status: 'STORNIERT',
    },
  })
}
