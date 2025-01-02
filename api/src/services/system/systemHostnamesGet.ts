import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

export const systemHostnamesGetProcedure = defineProtectedProcedure({
  key: 'hostnamesGet',
  method: 'query',
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
