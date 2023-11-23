import { Gender } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'

export const ZUserManagementCreateInputSchema = z.strictObject({
  data: z.strictObject({
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    role: z.enum(['GLIEDERUNG_ADMIN', 'ADMIN']),
    password: z.string(),
    birthdate: z.string().nullable(),
    gender: z.nativeEnum(Gender).nullable(),
  }),
})

export type TUserManagementCreateInputSchema = z.infer<typeof ZUserManagementCreateInputSchema>

type UserManagementCreateOptions = {
  input: TUserManagementCreateInputSchema
}

export async function userManagementCreate(options: UserManagementCreateOptions) {
  return prisma.user.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
