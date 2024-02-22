import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const systemHostnamesGetProcedure = defineProcedure({
  key: 'hostnamesGet',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({}),
  async handler() {
    return await prisma.hostname.findMany({
      orderBy: {
        hostname: 'asc',
      },
    })
  },
})
