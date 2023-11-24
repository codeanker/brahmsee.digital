import z from 'zod'

import prisma from '../../prisma'

export const ZUserManagementRemoveInputSchema = z.strictObject({
  id: z.number().int(),
})

export type TUserManagementRemoveInputSchema = z.infer<typeof ZUserManagementRemoveInputSchema>

type UserManagementRemoveOptions = {
  input: TUserManagementRemoveInputSchema
}

export async function userManagementRemove(options: UserManagementRemoveOptions) {
  return prisma.user.delete({
    where: {
      id: options.input.id,
    },
    select: {
      id: true,
    },
  })
}
