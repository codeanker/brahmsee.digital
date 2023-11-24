import z from 'zod'

import prisma from '../../prisma'
import { defineQuery } from '../../types/ZQuery'

export const ZPersonManagementListInputSchema = defineQuery({
  filter: z.strictObject({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
  }),
})

export type TPersonManagementListInputSchema = z.infer<typeof ZPersonManagementListInputSchema>

type PersonManagementListOptions = {
  input: TPersonManagementListInputSchema
}

export async function personManagementList(options: PersonManagementListOptions) {
  const { skip, take } = options.input.pagination
  const list = await prisma.person.findMany({
    skip,
    take,
    where: {
      firstname: options.input.filter.firstname,
      lastname: options.input.filter.lastname,
    },
  })
  return list
}
