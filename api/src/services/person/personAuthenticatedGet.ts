import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

export const personAuthenticatedGetProcedure = defineProtectedProcedure({
  key: 'authenticatedGet',
  method: 'query',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
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
