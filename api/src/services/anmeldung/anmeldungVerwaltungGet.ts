import { Role } from '@prisma/client'
import z from 'zod'

import prisma from "../../prisma.js"
import { defineProcedure } from "../../types/defineProcedure.js"

export const anmeldungVerwaltungGetProcedure = defineProcedure({
  key: 'verwaltungGet',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: z.strictObject({
    anmeldungId: z.number().optional(),
    personId: z.number().optional(),
  }),
  async handler(options) {
    const anmeldungen = await prisma.anmeldung.findMany({
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
        tshirtBestellt: true,
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
            konfektionsgroesse: true,
            notfallkontakte: true,
            address: true,
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

    return anmeldungen
  },
})
