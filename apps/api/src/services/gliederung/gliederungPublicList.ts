import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import { defineQuery, getOrderBy } from '../../types/defineQuery.js'

export const gliederungPublicListProcedure = definePublicQueryProcedure({
  key: 'publicList',
  inputSchema: defineQuery({
    filter: z.strictObject({
      name: z.string().optional(),
    }),
    orderBy: z.array(
      z.tuple([z.union([z.literal('id'), z.literal('name')]), z.union([z.literal('asc'), z.literal('desc')])])
    ),
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
      orderBy: getOrderBy(options.input.orderBy),
      select: {
        id: true,
        name: true,
        edv: true,
      },
    })
    return list
  },
})
