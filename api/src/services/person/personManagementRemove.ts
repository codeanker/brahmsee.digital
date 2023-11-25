import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZPersonManagementRemoveInputSchema = z.strictObject({
  id: z.number().int(),
})

export type TPersonManagementRemoveInputSchema = z.infer<typeof ZPersonManagementRemoveInputSchema>

type PersonManagementRemoveOptions = AuthenticatedContext & {
  input: TPersonManagementRemoveInputSchema
}

export async function personManagementRemove(options: PersonManagementRemoveOptions) {
  return prisma.person.delete({
    where: {
      id: options.input.id,
    },
    select: {
      id: true,
    },
  })
}
