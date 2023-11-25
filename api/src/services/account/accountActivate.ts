import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZAccountActivateInputSchema = z.strictObject({
  data: z.strictObject({
    accountId: z.number().int(),
  }),
})

export type TAccountActivateInputSchema = z.infer<typeof ZAccountActivateInputSchema>

type AccountActivateOptions = AuthenticatedContext & {
  input: TAccountActivateInputSchema
}

export async function accountActivate(options: AccountActivateOptions) {
  return prisma.account.update({
    where: {
      id: options.input.data.accountId,
    },
    data: {
      activatedAt: new Date(),
    },
  })
}
