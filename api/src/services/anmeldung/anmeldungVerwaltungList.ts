import { AnmeldungStatus, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineOrderBy } from '../../types/defineOrderBy.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { ZPaginationSchema } from '../../types/defineQuery.js'

const filterSchema = z.strictObject({
  unterveranstaltungId: z.number().optional(),
  veranstaltungId: z.number().optional(),
})

const where = (filter: { unterveranstaltungId?: number; veranstaltungId?: number }) => {
  return {
    OR: [
      {
        unterveranstaltungId: filter.unterveranstaltungId,
      },
      {
        unterveranstaltung: {
          veranstaltungId: filter.veranstaltungId,
        },
      },
    ],
  }
}

export const anmeldungVerwaltungListProcedure = defineProtectedQueryProcedure({
  key: 'verwaltungList',
  roleIds: [Role.ADMIN, Role.USER],
  inputSchema: z.strictObject({
    pagination: ZPaginationSchema,
    filter: filterSchema,
    orderBy: defineOrderBy(['status', 'createdBy']),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const anmeldungen = await prisma.anmeldung.findMany({
      skip,
      take,
      where: where(options.input.filter),
      select: {
        id: true,
        person: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            birthday: true,
            gliederung: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        status: true,
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

export const anmeldungVerwaltungCountProcedure = defineProtectedQueryProcedure({
  key: 'verwaltungCount',
  roleIds: [Role.ADMIN, Role.USER],
  inputSchema: z.strictObject({
    filter: filterSchema,
  }),
  async handler(options) {
    const countEntries = await Promise.all(
      Object.values(AnmeldungStatus).map(async (status) => {
        return [
          status,
          await prisma.anmeldung.count({
            where: {
              ...where(options.input.filter),
              status: status,
            },
          }),
        ]
      })
    )
    const total = countEntries.reduce((acc, [, count]) => acc + Number(count), 0)
    return { total, ...Object.fromEntries(countEntries) } as Record<AnmeldungStatus, number> & { total: number }
  },
})
