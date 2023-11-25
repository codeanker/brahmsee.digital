import { Gender } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZPersonVerwaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    firstname: z.string(),
    lastname: z.string(),
    birthday: z.string().nullable(),
    gender: z.nativeEnum(Gender).optional(),
  }),
})

export type TPersonVerwaltungCreateInputSchema = z.infer<typeof ZPersonVerwaltungCreateInputSchema>

type PersonVerwaltungCreateOptions = AuthenticatedContext & {
  input: TPersonVerwaltungCreateInputSchema
}

export async function personVerwaltungCreate(options: PersonVerwaltungCreateOptions) {
  return prisma.person.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
