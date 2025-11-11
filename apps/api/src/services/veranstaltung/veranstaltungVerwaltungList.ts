import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import { dayjs } from '@codeanker/helpers'
import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'

export const veranstaltungVerwaltungListProcedure = defineProtectedQueryProcedure({
  key: 'verwaltungList',
  roleIds: [Role.ADMIN],
  inputSchema: defineTableInput({
    filter: {
      name: z.string(),
      zeitraum: z.tuple([z.date(), z.date()]),
      meldeschluss: z.tuple([z.date(), z.date()]),
    },
    orderBy: ['name', 'teilnahmegebuehr'],
  }),
  async handler({ input: { pagination, filter, orderBy } }) {
    const where: Prisma.VeranstaltungWhereInput = {
      name: {
        contains: filter?.name,
        mode: 'insensitive',
      },
      meldeschluss: filter?.meldeschluss
        ? {
            gte: dayjs(filter.meldeschluss[0]).startOf('day').toDate(),
            lte: dayjs(filter.meldeschluss[1]).endOf('day').toDate(),
          }
        : undefined,
      OR:
        filter?.zeitraum === undefined
          ? undefined
          : [
              {
                beginn: {
                  gte: filter.zeitraum[0],
                  lte: filter.zeitraum[1],
                },
              },
              {
                ende: {
                  gte: filter.zeitraum[0],
                  lte: filter.zeitraum[1],
                },
              },
            ],
    }

    const total = await prisma.veranstaltung.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, pagination)

    const veranstaltungen = await prisma.veranstaltung.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      where,
      orderBy,
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
          select: {
            id: true,
            maxTeilnehmende: true,
            teilnahmegebuehr: true,
            meldebeginn: true,
            meldeschluss: true,
            gliederungId: true,
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

    const withCounts = veranstaltungen.map((veranstaltung) => {
      const count = veranstaltung.unterveranstaltungen.reduce((acc, unterveranstaltung) => {
        if (unterveranstaltung._count.Anmeldung) {
          acc += unterveranstaltung._count.Anmeldung
        }
        return acc
      }, 0)
      return {
        ...veranstaltung,
        anzahlAnmeldungen: count,
      }
    })

    return defineQueryResponse({ data: withCounts, total, pagination: { pageIndex, pageSize, pages } })
  },
})
