import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const personVerwaltungGetProcedure = defineProcedure({
  key: 'verwaltungGet',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    return await prisma.person.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      include: {
        address: {
          select: {
            zip: true,
            city: true,
            street: true,
            number: true,
          },
        },
        notfallkontakte: true,
        gliederung: true,
      },
    })
  },
})
