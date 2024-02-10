import { AnmeldungStatus } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'

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

export const anmeldungGliederungdListProcedure = defineProcedure({
  key: 'gliederungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'] },
  inputSchema: defineQuery({
    filter: filter,
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

export const anmeldungGliederungCountProcedure = defineProcedure({
  key: 'gliederungCount',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'] },
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
    return { total, ...Object.fromEntries(countEntries) }
  },
})
