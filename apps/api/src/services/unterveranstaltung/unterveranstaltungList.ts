import { Role, UnterveranstaltungType, type Prisma } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

export const unterveranstaltungListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: defineTableInput({
    filter: {
      veranstaltungId: z.number().optional(),
      gliederungName: z.string().optional(),
      type: z.nativeEnum(UnterveranstaltungType).optional(),
    },
  }),
  async handler({ ctx: { account }, input: { filter, pagination } }) {
    const where: Prisma.UnterveranstaltungWhereInput = {
      veranstaltungId: filter?.veranstaltungId,
      gliederung: {
        name: {
          contains: filter?.gliederungName,
          mode: 'insensitive',
        },
      },
      type: filter?.type,
    }

    // Role-based Filter
    if (account.role !== Role.ADMIN) {
      const gliederung = await getGliederungRequireAdmin(account.id)
      where.gliederungId = gliederung.id
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
