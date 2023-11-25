import z from 'zod'

import prisma from '../../prisma'

export const ZPersonAuthenticatedGetInputSchema = z.undefined()

export type TPersonAuthenticatedGetInputSchema = z.infer<typeof ZPersonAuthenticatedGetInputSchema>

type PersonAuthenticatedGetOptions = {
  input: TPersonAuthenticatedGetInputSchema
  ctx: {
    accountId: number
  }
}

export async function personAuthenticatedGet(options: PersonAuthenticatedGetOptions) {
  return prisma.account.findUniqueOrThrow({
    where: {
      id: options.ctx.accountId,
    },
    select: {
      person: {
        select: {
          id: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  })
}
