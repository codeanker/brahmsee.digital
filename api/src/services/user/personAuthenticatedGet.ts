import z from 'zod'

import prisma from '../../prisma'

export const ZPersonAuthenticatedGetInputSchema = z.undefined()

export type TPersonAuthenticatedGetInputSchema = z.infer<typeof ZPersonAuthenticatedGetInputSchema>

type PersonAuthenticatedGetOptions = {
  input: TPersonAuthenticatedGetInputSchema
  ctx: {
    accountId: string
  }
}

export async function personAuthenticatedGet(options: PersonAuthenticatedGetOptions) {
  return prisma.person.findUniqueOrThrow({
    where: {
      accountId: parseInt(options.ctx.accountId),
    },
    select: {
      id: true,
      firstname: true,
      lastname: true,
    },
  })
}
