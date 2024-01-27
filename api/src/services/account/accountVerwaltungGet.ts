import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const accountVerwaltungGetProcedure = defineProcedure({
  key: 'verwaltungGet',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    return prisma.account.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        id: true,
        email: true,
        activatedAt: true,
        status: true,
        role: true,
        person: {
          select: {
            firstname: true,
            lastname: true,
            birthday: true,
            gender: true,
          },
        },
        activationToken: true,
      },
    })
  },
})
