import { Gender } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZPersonManagementPatchInputSchema = z.strictObject({
  id: z.number().int(),
  data: z.strictObject({
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    birthdate: z.string().nullable(),
    gender: z.nativeEnum(Gender).nullable(),
  }),
})

export type TPersonManagementPatchInputSchema = z.infer<typeof ZPersonManagementPatchInputSchema>

type PersonManagementPatchOptions = AuthenticatedContext & {
  input: TPersonManagementPatchInputSchema
}

export async function personManagementPatch(options: PersonManagementPatchOptions) {
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
