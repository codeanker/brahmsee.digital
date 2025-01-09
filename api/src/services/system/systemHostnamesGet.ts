import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const systemHostnamesGetProcedure = defineProtectedQueryProcedure({
  key: 'hostnamesGet',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({}),
  async handler() {
    return await prisma.hostname.findMany({
      orderBy: {
        hostname: 'asc',
      },
    })
  },
})
