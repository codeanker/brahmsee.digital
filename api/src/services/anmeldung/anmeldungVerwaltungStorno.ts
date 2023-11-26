import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungVerwaltungStornoInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungVerwaltungStornoInputSchema = z.infer<typeof ZAnmeldungVerwaltungStornoInputSchema>

type AnmeldungVerwaltungStornoOptions = AuthenticatedContext & {
  input: TAnmeldungVerwaltungStornoInputSchema
}

export async function anmeldungVerwaltungStorno(options: AnmeldungVerwaltungStornoOptions) {
  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
    },
    data: {
      status: 'STORNIERT',
    },
  })
}
