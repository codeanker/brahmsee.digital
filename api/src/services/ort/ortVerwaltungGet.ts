import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

export const ortVerwaltungGetProcedure = defineProtectedProcedure({
  key: 'verwaltungGet',
  method: 'query',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    return prisma.ort.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        id: true,
        name: true,
        address: {
          select: {
            zip: true,
            city: true,
            street: true,
            streetNumber: true,
          },
        },
      },
    })
  },
})
