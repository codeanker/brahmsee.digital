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
      veranstaltungId: z.string().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const anmeldungen = await prisma.anmeldung.findMany({
      skip,
      take,
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
      },
    })

    return anmeldungen
  },
})
