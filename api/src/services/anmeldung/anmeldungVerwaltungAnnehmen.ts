import z from 'zod'

import { getGliederungRequireAdmin } from '../../helpers/getGliederungRequireAdmin'
import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const anmeldungVerwaltungAnnehmenProcedure = defineProcedure({
  key: 'verwaltungAnnehmen',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      anmeldungId: z.number().int(),
    }),
  }),
  async handler(options) {
    type AnmeldungWhereUniqueInput = Parameters<typeof prisma.anmeldung.update>[0]['where']
    const where: AnmeldungWhereUniqueInput = { id: options.input.data.anmeldungId }

    if (options.ctx.account.role !== 'ADMIN') {
      const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
      where.unterveranstaltung = {
        gliederungId: gliederung.id,
      }
    }
    return prisma.anmeldung.update({
      where,
      data: {
        status: 'ANGENOMMEN',
      },
    })
  },
})
