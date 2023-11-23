import z from 'zod'

import prisma from '../../prisma'

export const ZUserAuthenticatedGetInputSchema = z.undefined()

export type TUserAuthenticatedGetInputSchema = z.infer<typeof ZUserAuthenticatedGetInputSchema>

type UserAuthenticatedGetOptions = {
  input: TUserAuthenticatedGetInputSchema
  ctx: {
    userId: string
  }
}

export async function userAuthenticatedGet(options: UserAuthenticatedGetOptions) {
  return prisma.user.findUniqueOrThrow({
    where: {
      id: parseInt(options.ctx.userId),
    },
    select: {
      id: true,
      email: true,
    },
  })
}
