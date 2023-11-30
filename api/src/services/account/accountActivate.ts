import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const accountActivateProcedure = defineProcedure({
  key: 'activate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      accountId: z.number().int(),
    }),
  }),
  async handler(options) {
    return prisma.account.update({
      where: {
        id: options.input.data.accountId,
      },
      data: {
        activatedAt: new Date(),
      },
    })
  },
})
