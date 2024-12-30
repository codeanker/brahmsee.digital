import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProcedure } from '../../types/defineProcedure.js'

export const systemHostnamesGetProcedure = defineProcedure({
  key: 'hostnamesGet',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: z.strictObject({}),
  async handler() {
    return await prisma.hostname.findMany({
      orderBy: {
        hostname: 'asc',
      },
    })
  },
})
