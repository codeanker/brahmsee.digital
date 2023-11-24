import z from 'zod'

import prisma from '../../prisma'

export const ZPersonManagementGetInputSchema = z.strictObject({
  id: z.number().int(),
})

export type TPersonManagementGetInputSchema = z.infer<typeof ZPersonManagementGetInputSchema>

type PersonManagementGetOptions = {
  input: TPersonManagementGetInputSchema
}

export async function personManagementGet(options: PersonManagementGetOptions) {
  return prisma.person.findFirstOrThrow({
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
