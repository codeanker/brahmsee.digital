import { Gender } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZPersonVerwaltungPatchInputSchema = z.strictObject({
  id: z.number().int(),
  data: z.strictObject({
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    birthday: z.string().nullable(),
    gender: z.nativeEnum(Gender).nullable(),
  }),
})

export type TPersonVerwaltungPatchInputSchema = z.infer<typeof ZPersonVerwaltungPatchInputSchema>

type PersonVerwaltungPatchOptions = AuthenticatedContext & {
  input: TPersonVerwaltungPatchInputSchema
}

export async function personVerwaltungPatch(options: PersonVerwaltungPatchOptions) {
  return prisma.person.update({
    where: {
      id: options.input.id,
    },
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
