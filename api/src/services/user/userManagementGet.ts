import z from 'zod'

import prisma from '../../prisma'

export const ZUserManagementGetInputSchema = z.strictObject({
  id: z.number().int(),
})

export type TUserManagementGetInputSchema = z.infer<typeof ZUserManagementGetInputSchema>

type UserManagementGetOptions = {
  input: TUserManagementGetInputSchema
}

export async function userManagementGet(options: UserManagementGetOptions) {
  return prisma.user.findFirstOrThrow({
    where: {
      id: options.input.id,
    },
    select: {
      id: true,
      email: true,
      firstname: true,
      lastname: true,
      role: true,
    },
  })
}
