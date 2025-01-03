import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

export const personVerwaltungRemoveProcedure = defineProtectedProcedure({
  key: 'verwaltungRemove',
  method: 'mutation',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    return prisma.person.delete({
      where: {
        id: options.input.id,
      },
    })
  },
})
