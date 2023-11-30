import z from 'zod'

import { getGliederungRequireAdmin } from '../../helpers/getGliederungRequireAdmin'
import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const unterveranstaltungGliederungListProcedure = defineProcedure({
  key: 'gliederungList',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['GLIEDERUNG_ADMIN'] },
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
        meldebeginn: true,
        meldeschluss: true,
        teilnahmegebuehr: true,
        maxTeilnehmende: true,
      },
    })

    return veranstaltungen
  },
})
