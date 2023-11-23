import { Gender } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'

export const ZUserManagementPatchInputSchema = z.strictObject({
  id: z.number().int(),
  data: z.strictObject({
    email: z.string(),
    firstname: z.string(),
    lastname: z.string(),
    birthdate: z.string().nullable(),
    gender: z.nativeEnum(Gender).nullable(),
  }),
})

export type TUserManagementPatchInputSchema = z.infer<typeof ZUserManagementPatchInputSchema>

type UserManagementPatchOptions = {
  input: TUserManagementPatchInputSchema
}

export async function userManagementPatch(options: UserManagementPatchOptions) {
  return prisma.user.update({
    where: {
      id: options.input.id,
    },
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
