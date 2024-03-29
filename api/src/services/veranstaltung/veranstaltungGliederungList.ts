import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'

export const veranstaltungGliederungListProcedure = defineProcedure({
  key: 'gliederungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['GLIEDERUNG_ADMIN'] },
  inputSchema: defineQuery({
    filter: z.strictObject({}),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)

    const data = await prisma.veranstaltung.findMany({
      skip,
      take,
      where: {
        OR: [
          {
            unterveranstaltungen: {
              some: {
                gliederungId: gliederung.id,
              },
            },
          },
          {
            meldebeginn: {
              lte: new Date(),
            },
            meldeschluss: {
              gte: new Date(),
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        beginn: true,
        ende: true,
        ort: {
          select: {
            name: true,
            id: true,
          },
        },
        meldebeginn: true,
        meldeschluss: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
        unterveranstaltungen: {
          where: {
            gliederungId: gliederung.id,
          },
          select: {
            id: true,
          },
        },
        hostname: {
          select: {
            id: true,
            hostname: true,
          },
        },
      },
    })

    return data
  },
})
