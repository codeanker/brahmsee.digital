import z from 'zod'

import prisma from '../../prisma'
import { ZQuerySchema } from '../../types/ZQuery'

export const ZUserManagementListInputSchema = ZQuerySchema({
  filter: z.strictObject({
    email: z.string().optional(),
  }),
})

export type TUserManagementListInputSchema = z.infer<typeof ZUserManagementListInputSchema>

type UserManagementListOptions = {
  input: TUserManagementListInputSchema
}

export async function userManagementList(options: UserManagementListOptions) {
  const { skip, take } = options.input.pagination
  const list = await prisma.user.findMany({
    skip,
    take,
    where: {
      email: options.input.filter.email,
    },
  })
  return list
}
