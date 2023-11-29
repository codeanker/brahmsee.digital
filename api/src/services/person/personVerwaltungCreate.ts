import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

import { personSchema, getPersonCreateData } from './schema/person.schema'

export const ZPersonVerwaltungCreateInputSchema = z.strictObject({
  data: personSchema,
})

export type TPersonVerwaltungCreateInputSchema = z.infer<typeof ZPersonVerwaltungCreateInputSchema>

type PersonVerwaltungCreateOptions = AuthenticatedContext & {
  input: TPersonVerwaltungCreateInputSchema
}

export async function personVerwaltungCreate(options: PersonVerwaltungCreateOptions) {
  return prisma.person.create({
    data: {
      ...getPersonCreateData(options.input.data),
    },
    select: {
      id: true,
    },
  })
}
