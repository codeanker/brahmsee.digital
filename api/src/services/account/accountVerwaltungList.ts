import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const accountVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      email: z.string().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const list = await prisma.account.findMany({
      skip,
      take,
      where: {
        email: options.input.filter.email,
      },
      include: {
        person: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    })
    return list
  },
})
