import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const anmeldungVerwaltungAblehnenProcedure = defineProcedure({
  key: 'verwaltungAblehnen',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      anmeldungId: z.number().int(),
    }),
  }),
  async handler(options) {
    return prisma.anmeldung.update({
      where: {
        id: options.input.data.anmeldungId,
      },
      data: {
        status: 'ABGELEHNT',
      },
    })
  },
})
