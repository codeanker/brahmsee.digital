import { Role, UnterveranstaltungType, type Prisma } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'
import { dayjs } from '@codeanker/helpers'

export const unterveranstaltungListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    mode: z
      .discriminatedUnion('mode', [
        z.strictObject({
          mode: z.literal('veranstaltung'),
          veranstaltungId: z.string().uuid(),
        }),
        z.strictObject({
          mode: z.literal('gliederung'),
          gliederungId: z.string().uuid(),
        }),
      ])
      .optional(),
    table: defineTableInput({
      filter: {
        gliederungName: z.string().optional(),
        type: z.nativeEnum(UnterveranstaltungType).optional(),
        meldeschluss: z.tuple([z.date(), z.date()]),
      },
      orderBy: ['meldeschluss', 'teilnahmegebuehr'],
    }),
  }),
  async handler({
    ctx: { account },
    input: {
      mode,
      table: { filter, pagination },
    },
  }) {
    const where: Prisma.UnterveranstaltungWhereInput = {
      veranstaltungId: mode?.mode === 'veranstaltung' ? mode.veranstaltungId : undefined,
      gliederungId: mode?.mode === 'gliederung' ? mode.gliederungId : undefined,
      gliederung: {
        name: {
          contains: filter?.gliederungName,
          mode: 'insensitive',
        },
      },
      type: filter?.type,
      meldeschluss:
        filter?.meldeschluss === undefined
          ? undefined
          : {
              gte: dayjs(filter.meldeschluss[0]).startOf('day').toDate(),
              lte: dayjs(filter.meldeschluss[1]).endOf('day').toDate(),
            },
    }

    // Role-based Filter
    if (account.role !== Role.ADMIN) {
      const gliederung = await getGliederungRequireAdmin(account.id)
      where.gliederungId = gliederung.id // TODO:
    }

    const total = await prisma.unterveranstaltung.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, pagination)

    const veranstaltungen = await prisma.unterveranstaltung.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      orderBy: [
        {
          veranstaltung: {
            name: 'asc',
          },
        },
        {
          gliederung: {
            name: 'asc',
          },
        },
      ],
      where,
      select: {
        id: true,
        type: true,
        beschreibung: true,
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
        veranstaltung: {
          select: {
            id: true,
            name: true,
            hostname: true,
          },
        },
        _count: {
          select: {
            Anmeldung: {
              where: {
                status: 'BESTAETIGT',
              },
            },
          },
        },
        meldebeginn: true,
        meldeschluss: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
      },
    })

    return defineQueryResponse({ data: veranstaltungen, total, pagination: { pageIndex, pageSize, pages } })
  },
})
