import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungVerwaltungAblehnenInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungVerwaltungAblehnenInputSchema = z.infer<typeof ZAnmeldungVerwaltungAblehnenInputSchema>

type AnmeldungVerwaltungAblehnenOptions = AuthenticatedContext & {
  input: TAnmeldungVerwaltungAblehnenInputSchema
}

export async function anmeldungVerwaltungAblehnen(options: AnmeldungVerwaltungAblehnenOptions) {
  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
    },
    data: {
      status: 'ABGELEHNT',
    },
  })
}
