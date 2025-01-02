import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

export const personGliederungGetProcedure = defineProtectedProcedure({
  key: 'gliederungGet',
  method: 'query',
  roleIds: [Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    return await prisma.person.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        birthday: true,
        gender: true,
        email: true,
        telefon: true,
        address: {
          select: {
            zip: true,
            city: true,
            street: true,
            streetNumber: true,
          },
        },
        nahrungsmittelIntoleranzen: true,
        weitereIntoleranzen: true,
        konfektionsgroesse: true,
        essgewohnheit: true,
        notfallkontakte: {
          select: {
            firstname: true,
            lastname: true,
            telefon: true,
            istErziehungsberechtigt: true,
          },
        },
        gliederung: true,
      },
    })
  },
})
