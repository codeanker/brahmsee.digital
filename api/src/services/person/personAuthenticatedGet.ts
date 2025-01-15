import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const personAuthenticatedGetProcedure = defineProtectedQueryProcedure({
  key: 'authenticatedGet',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
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
