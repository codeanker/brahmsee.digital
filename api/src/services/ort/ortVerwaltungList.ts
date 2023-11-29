import z from 'zod'

import { defineProcedure } from '../../helpers/defineProcedure'
import prisma from '../../prisma'
import { defineQuery } from '../../types/ZQuery'

export const ortVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      name: z.string().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination

    return await prisma.ort.findMany({
      skip,
      take,
      where: {
        name: options.input.filter.name,
      },
      select: {
        id: true,
        name: true,
      },
    })
  },
})
