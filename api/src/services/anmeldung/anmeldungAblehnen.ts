import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAnmeldungAblehnenInputSchema = z.strictObject({
  data: z.strictObject({
    anmeldungId: z.number().int(),
  }),
})

export type TAnmeldungAblehnenInputSchema = z.infer<typeof ZAnmeldungAblehnenInputSchema>

type AnmeldungAblehnenOptions = AuthenticatedContext & {
  input: TAnmeldungAblehnenInputSchema
}

export async function anmeldungAblehnen(options: AnmeldungAblehnenOptions) {
  return prisma.anmeldung.update({
    where: {
      id: options.input.data.anmeldungId,
    },
    data: {
      status: 'ABGELEHNT',
    },
  })
}
