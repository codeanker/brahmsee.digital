import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const personAuthenticatedGetProcedure = defineProcedure({
  key: 'authenticatedGet',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'] },
  inputSchema: z.undefined(),
  async handler(options) {
    return prisma.account.findUniqueOrThrow({
      where: {
        id: options.ctx.accountId,
      },
      select: {
        id: true,
        person: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    })
  },
})
