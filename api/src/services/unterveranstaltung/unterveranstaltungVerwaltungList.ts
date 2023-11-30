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
      gliederungId: z.number().optional(),
      name: z.string().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const where =
      options.input.filter.gliederungId != null
        ? {
            gliederungId: options.input.filter.gliederungId,
          }
        : undefined
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
        meldebeginn: true,
        meldeschluss: true,
        teilnahmegebuehr: true,
        maxTeilnehmende: true,
      },
    })

    return veranstaltungen
  },
})
