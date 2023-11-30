import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const anmeldungTeilnehmerStornoProcedure = defineProcedure({
  key: 'teilnehmerStorno',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['GLIEDERUNG_ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      anmeldungId: z.number().int(),
    }),
  }),
  async handler(options) {
    return prisma.anmeldung.update({
      where: {
        id: options.input.data.anmeldungId,
        person: {
          is: {
            account: {
              is: {
                id: options.ctx.accountId,
              },
            },
          },
        },
      },
      data: {
        status: 'STORNIERT',
      },
    })
  },
})
