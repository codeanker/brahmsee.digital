import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const gliederungPublicListProcedure = defineProcedure({
  key: 'publicList',
  method: 'query',
  protection: { type: 'public' },
  inputSchema: defineQuery({
    filter: z.strictObject({
      name: z.string().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const list = await prisma.gliederung.findMany({
      skip,
      take,
      where: {
        name: {
          contains: options.input.filter.name,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        name: true,
        edv: true,
      },
    })
    return list
  },
})
