import z from 'zod'

import prisma from '../../prisma'

export const ZPersonManagementRemoveInputSchema = z.strictObject({
  id: z.number().int(),
})

export type TPersonManagementRemoveInputSchema = z.infer<typeof ZPersonManagementRemoveInputSchema>

type PersonManagementRemoveOptions = {
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
