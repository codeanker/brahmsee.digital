import type { Prisma } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const unterveranstaltungVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      veranstaltungId: z.number().optional(),
      gliederungId: z.number().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const where: Prisma.UnterveranstaltungWhereInput = {}

    if (options.input.filter.gliederungId !== undefined) {
      where.gliederungId = options.input.filter.gliederungId
    }
    if (options.input.filter.veranstaltungId !== undefined) {
      where.veranstaltungId = options.input.filter.veranstaltungId
    }
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
        meldebeginn: true,
        meldeschluss: true,
        teilnahmegebuehr: true,
        maxTeilnehmende: true,
      },
    })

    return veranstaltungen
  },
})
