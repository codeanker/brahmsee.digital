import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZPersonVerwaltungGetInputSchema = z.strictObject({
  id: z.number().int(),
})

export type TPersonVerwaltungGetInputSchema = z.infer<typeof ZPersonVerwaltungGetInputSchema>

type PersonVerwaltungGetOptions = AuthenticatedContext & {
  input: TPersonVerwaltungGetInputSchema
}

export async function personVerwaltungGet(options: PersonVerwaltungGetOptions) {
  return prisma.person.findUniqueOrThrow({
    where: {
      id: options.input.id,
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
    },
  })
}
