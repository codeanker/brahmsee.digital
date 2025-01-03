import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

export const gliederungVerwaltungGetProcedure = defineProtectedProcedure({
  key: 'verwaltungGet',
  method: 'query',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.number(),
  }),
  async handler(options) {
    return prisma.gliederung.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        id: true,
        name: true,
        edv: true,
      },
    })
  },
})
