import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const anmeldungVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      unterveranstaltungId: z.number().optional(),
      veranstaltungId: z.number().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const anmeldungen = await prisma.anmeldung.findMany({
      skip,
      take,
      where: {
        OR: [
          {
            unterveranstaltungId: options.input.filter.unterveranstaltungId,
          },
          {
            unterveranstaltung: {
              veranstaltungId: options.input.filter.veranstaltungId,
            },
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
      orderBy: {
        createdAt: 'desc',
      },
    })

    return anmeldungen
  },
})
