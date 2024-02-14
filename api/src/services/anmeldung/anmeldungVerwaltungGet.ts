import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const anmeldungVerwaltungGetProcedure = defineProcedure({
  key: 'verwaltungGet',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
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
        person: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            birthday: true,
            gender: true,
            email: true,
            telefon: true,
            essgewohnheit: true,
            nahrungsmittelIntoleranzen: true,
            weitereIntoleranzen: true,
            konfektionsgroesse: true,
            notfallkontakte: true,
            address: true,
            gliederung: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        unterveranstaltung: {
          select: {
            veranstaltung: {
              select: {
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
