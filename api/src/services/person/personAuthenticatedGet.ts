import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZPersonAuthenticatedGetInputSchema = z.undefined()

export type TPersonAuthenticatedGetInputSchema = z.infer<typeof ZPersonAuthenticatedGetInputSchema>

type PersonAuthenticatedGetOptions = AuthenticatedContext & {
  input: TPersonAuthenticatedGetInputSchema
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
