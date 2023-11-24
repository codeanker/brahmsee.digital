import { Gender } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'

export const ZPersonManagementCreateInputSchema = z.strictObject({
  data: z.strictObject({
    firstname: z.string(),
    lastname: z.string(),
    birthdate: z.string().nullable(),
    gender: z.nativeEnum(Gender).optional(),
  }),
})

export type TPersonManagementCreateInputSchema = z.infer<typeof ZPersonManagementCreateInputSchema>

type PersonManagementCreateOptions = {
  input: TPersonManagementCreateInputSchema
}

export async function personManagementCreate(options: PersonManagementCreateOptions) {
  return prisma.person.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
