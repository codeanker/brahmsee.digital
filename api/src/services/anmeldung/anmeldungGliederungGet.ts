import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const anmeldungGliederungGetProcedure = defineProcedure({
  key: 'gliederungGet',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'] },
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
        person: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            birthday: true,
            konfektionsgroesse: true,
            gliederung: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        status: true,
        tshirtBestellt: true,
        createdAt: true,
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
