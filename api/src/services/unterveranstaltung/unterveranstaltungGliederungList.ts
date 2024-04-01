import type { Prisma } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'

export const unterveranstaltungGliederungListProcedure = defineProcedure({
  key: 'gliederungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['GLIEDERUNG_ADMIN', 'ADMIN'] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      veranstaltungId: z.number().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const where: Prisma.UnterveranstaltungWhereInput = {}

    if (options.input.filter.veranstaltungId !== undefined) {
      where.veranstaltungId = options.input.filter.veranstaltungId
    }

    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
    where.gliederungId = gliederung.id

    const veranstaltungen = await prisma.unterveranstaltung.findMany({
      skip,
      take,
      where: where,
      select: {
        id: true,
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
          },
        },
        _count: {
          select: { Anmeldung: true },
        },
        meldebeginn: true,
        meldeschluss: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
      },
    })

    return veranstaltungen
  },
})
