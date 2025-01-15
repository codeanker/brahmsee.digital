import { AnmeldungStatus, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { ZPaginationSchema } from '../../types/defineQuery.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

const filter = z.strictObject({
  unterveranstaltungId: z.number().optional(),
  veranstaltungId: z.number().optional(),
})

const where = (filter: { gliederungId: number; unterveranstaltungId?: number; veranstaltungId?: number }) => {
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
    unterveranstaltung: {
      gliederungId: filter.gliederungId,
    },
  }
}

export const anmeldungGliederungdListProcedure = defineProtectedQueryProcedure({
  key: 'gliederungList',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    pagination: ZPaginationSchema,
    filter: filter,
    orderBy: z
      .array(
        z.union([
          z.object({
            status: z.union([z.literal('asc'), z.literal('desc')]),
          }),
          z.object({
            createdAt: z.union([z.literal('asc'), z.literal('desc')]),
          }),
        ])
      )
      .optional(),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)

    const anmeldungen = await prisma.anmeldung.findMany({
      skip,
      take,
      where: where({ gliederungId: gliederung.id, ...options.input.filter }),
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

export const anmeldungGliederungCountProcedure = defineProtectedQueryProcedure({
  key: 'gliederungCount',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    filter: filter,
  }),
  async handler(options) {
    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
    const countEntries = await Promise.all(
      Object.values(AnmeldungStatus).map(async (status) => {
        return [
          status,
          await prisma.anmeldung.count({
            where: {
              ...where({ gliederungId: gliederung.id, ...options.input.filter }),
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
