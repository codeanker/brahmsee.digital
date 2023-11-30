import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const anmeldungVerwaltungAnnehmenProcedure = defineProcedure({
  key: 'verwaltungAnnehmen',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
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
        status: 'ANGENOMMEN',
      },
    })
  },
})
