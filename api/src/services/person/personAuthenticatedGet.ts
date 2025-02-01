import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const personSelfSelect = {
  id: true,
  role: true,
  status: true,
  person: {
    select: {
      id: true,
      firstname: true,
      lastname: true,
      gliederungId: true,
      photoId: true,
    },
  },
} satisfies Prisma.AccountSelect

export const personAuthenticatedGetProcedure = defineProtectedQueryProcedure({
  key: 'authenticatedGet',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
  inputSchema: z.void(),
  handler: (options) =>
    prisma.account.findUniqueOrThrow({
      where: {
        id: options.ctx.accountId,
      },
      select: personSelfSelect,
    }),
})
