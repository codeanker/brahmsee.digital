import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const personVerwaltungRemoveProcedure = defineProcedure({
  key: 'verwaltungRemove',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    return prisma.person.delete({
      where: {
        id: options.input.id,
      },
    })
  },
})
