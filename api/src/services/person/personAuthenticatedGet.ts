import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProcedure } from '../../types/defineProcedure.js'

export const personAuthenticatedGetProcedure = defineProcedure({
  key: 'authenticatedGet',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN] },
  inputSchema: z.undefined(),
  async handler(options) {
    return prisma.account.findUniqueOrThrow({
      where: {
        id: options.ctx.accountId,
      },
      select: {
        id: true,
        role: true,
        person: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            gliederungId: true,
          },
        },
      },
    })
  },
})
