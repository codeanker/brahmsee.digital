import type { Prisma } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

const inputSchema = defineQuery({
  filter: z.strictObject({
    name: z.string().optional(),
  }),
})

function getFilterWhere(input: z.infer<typeof inputSchema>['filter']): Prisma.OrtWhereInput {
  return {
    name: input.name,
  }
}

export const ortVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema,
  async handler(options) {
    const { skip, take } = options.input.pagination

    return await prisma.ort.findMany({
      skip,
      take,
      where: getFilterWhere(options.input.filter),
      select: {
        id: true,
        name: true,
      },
    })
  },
})

export const ortVerwaltungListCountProcedure = defineProcedure({
  key: 'verwaltungListCount',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema,
  async handler(options) {
    return await prisma.ort.count({
      where: {
        name: options.input.filter.name,
      },
    })
  },
})
