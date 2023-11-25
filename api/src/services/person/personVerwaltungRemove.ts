import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZPersonVerwaltungRemoveInputSchema = z.strictObject({
  id: z.number().int(),
})

export type TPersonVerwaltungRemoveInputSchema = z.infer<typeof ZPersonVerwaltungRemoveInputSchema>

type PersonVerwaltungRemoveOptions = AuthenticatedContext & {
  input: TPersonVerwaltungRemoveInputSchema
}

export async function personVerwaltungRemove(options: PersonVerwaltungRemoveOptions) {
  return prisma.person.delete({
    where: {
      id: options.input.id,
    },
    select: {
      id: true,
    },
  })
}
