import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'

export const anmeldungGliederungdListProcedure = defineProcedure({
  key: 'gliederungList',
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
    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)

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
        unterveranstaltung: {
          gliederungId: gliederung.id,
        },
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
