import z from 'zod'

import { getGliederungRequireAdmin } from '../../helpers/getGliederungRequireAdmin'
import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const anmeldungGliederungStornoProcedure = defineProcedure({
  key: 'gliederungStorno',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      anmeldungId: z.number().int(),
    }),
  }),
  async handler(options) {
    const gliederung = await getGliederungRequireAdmin(options.ctx.accountId)
    return prisma.anmeldung.update({
      where: {
        id: options.input.data.anmeldungId,
        unterveranstaltung: {
          gliederungId: gliederung.id,
        },
      },
      data: {
        status: 'STORNIERT',
      },
    })
  },
})
