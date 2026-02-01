import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const ortVerwaltungRemoveProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungRemove',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.string().uuid(),
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
