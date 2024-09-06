import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const veranstaltungVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      name: z.string().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const veranstaltungen = await prisma.veranstaltung.findMany({
      skip,
      take,
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

    return veranstaltungen
  },
})
