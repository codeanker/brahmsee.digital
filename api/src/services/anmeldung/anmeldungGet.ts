import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const anmeldungGetProcedure = defineProtectedQueryProcedure({
  key: 'get',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    anmeldungId: z.number().optional(),
    personId: z.number().optional(),
  }),
  handler: (options) => {
    return prisma.anmeldung.findMany({
      where: {
        OR: [
          {
            personId: options.input.personId,
          },
          {
            id: options.input.anmeldungId,
          },
        ],
      },
      select: {
        id: true,
        status: true,
        mahlzeiten: true,
        uebernachtungsTage: true,
        createdAt: true,
        comment: true,
        customFieldValues: {
          select: {
            id: true,
            value: true,
            field: true,
          },
        },
        person: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            birthday: true,
            gender: true,
            email: true,
            telefon: true,
            gliederung: {
              select: {
                id: true,
                name: true,
                edv: true,
              },
            },
            essgewohnheit: true,
            nahrungsmittelIntoleranzen: true,
            weitereIntoleranzen: true,
            notfallkontakte: true,
            address: true,
            photoId: true,
          },
        },
        unterveranstaltung: {
          select: {
            id: true,
            veranstaltung: {
              select: {
                id: true,
                name: true,
                meldeschluss: true,
              },
            },
          },
        },
      },
    })
  },
})
