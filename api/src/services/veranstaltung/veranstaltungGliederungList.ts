import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'
import { defineQuery } from '../../types/defineQuery.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

export const veranstaltungGliederungListProcedure = defineProtectedProcedure({
  key: 'gliederungList',
  method: 'query',
  roleIds: [Role.GLIEDERUNG_ADMIN],
  inputSchema: defineQuery({
    filter: z.strictObject({}),
    orderBy: z.array(
      z.tuple([z.union([z.literal('id'), z.literal('name')]), z.union([z.literal('asc'), z.literal('desc')])])
    ),
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
            _count: {
              select: {
                Anmeldung: {
                  where: {
                    status: {
                      equals: 'BESTAETIGT',
                    },
                  },
                },
              },
            },
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
