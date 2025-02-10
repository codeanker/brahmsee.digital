import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const personVerwaltungRemoveProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungRemove',
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
