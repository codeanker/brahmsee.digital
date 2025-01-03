import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

export const ortVerwaltungRemoveProcedure = defineProtectedProcedure({
  key: 'verwaltungRemove',
  method: 'mutation',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler({ input }) {
    return prisma.ort.delete({
      where: {
        id: input.id,
      },
      select: {
        id: true,
      },
    })
  },
})
