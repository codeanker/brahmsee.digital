import { AnmeldungStatus } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { ZPaginationSchema } from '../../types/defineQuery'

const filter = z.union([
  z.strictObject({
    unterveranstaltungId: z.undefined(),
    veranstaltungId: z.number(),
  }),
  z.strictObject({
    unterveranstaltungId: z.number(),
    veranstaltungId: z.undefined(),
  }),
])

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

export const anmeldungVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
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

export const anmeldungVerwaltungCountProcedure = defineProcedure({
  key: 'verwaltungCount',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    filter: filter,
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
    return { total, ...Object.fromEntries(countEntries) }
  },
})
