import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin'

export const unterveranstaltungGliederungListProcedure = defineProcedure({
  key: 'gliederungList',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['GLIEDERUNG_ADMIN', 'ADMIN'] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      name: z.string().optional(),
    }),
  }),
  async handler(options) {
    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
    const { skip, take } = options.input.pagination
    const veranstaltungen = await prisma.unterveranstaltung.findMany({
      skip,
      take,
      where: {
        gliederungId: gliederung.id,
      },
      select: {
        id: true,
        beschreibung: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
        meldebeginn: true,
        meldeschluss: true,
      },
    })

    return veranstaltungen
  },
})
