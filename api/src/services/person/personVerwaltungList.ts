import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'
import { defineQuery } from '../../types/ZQuery'

export const ZPersonVerwaltungListInputSchema = defineQuery({
  filter: z.strictObject({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
  }),
})

export type TPersonVerwaltungListInputSchema = z.infer<typeof ZPersonVerwaltungListInputSchema>

type PersonVerwaltungListOptions = AuthenticatedContext & {
  input: TPersonVerwaltungListInputSchema
}

export async function personVerwaltungList(options: PersonVerwaltungListOptions) {
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
