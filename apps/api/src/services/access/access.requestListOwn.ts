import { z } from 'zod'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import prisma from '../../prisma.js'

export const listOwnGliederungAdminRequestsProcedure = defineProtectedQueryProcedure({
  key: 'listOwnGliederungAdminRequests',
  roleIds: ['USER', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.void(),
  handler: async ({ ctx }) => {
    const requests = await prisma.gliederungToAccount.findMany({
      where: {
        accountId: ctx.accountId,
        confirmedByGliederung: false,
      },
      select: {
        id: true,
        gliederungId: true,
        confirmedByGliederung: true,
        gliederung: {
          select: {
            name: true,
          },
        },
      },
    })

    return requests
  },
})
