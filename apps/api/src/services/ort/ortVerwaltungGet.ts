import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const ortVerwaltungGetProcedure = defineProtectedQueryProcedure({
  key: 'verwaltungGet',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.string().uuid(),
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
            country: true,
            lon: true,
            lat: true,
          },
        },
      },
    })
  },
})
