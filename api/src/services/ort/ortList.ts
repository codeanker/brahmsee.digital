import { Role, type Prisma } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

const inputSchema = defineQuery({
  filter: z.strictObject({
    name: z.string().optional(),
    city: z.string().optional(),
  }),
  orderBy: z.array(
    z.tuple([
      z.union([z.literal('id'), z.literal('name'), z.literal('address.city')]),
      z.union([z.literal('asc'), z.literal('desc')]),
    ])
  ),
})
type TInput = z.infer<typeof inputSchema>

async function getWhere(
  filter: TInput['filter'],
  _account: {
    id: number
    role: Role
  }
): Promise<Prisma.OrtWhereInput> {
  const where: Prisma.OrtWhereInput = {}

  // Input filter
  if (filter.name != undefined && filter.name != '') {
    where.name = {
      contains: filter.name,
    }
  }
  if (filter.city != undefined && filter.city != '') {
    where.address = {
      city: {
        contains: filter.city,
      },
    }
  }

  // Role filter
  // --

  return where
}

export const ortListProcedure = defineProcedure({
  key: 'list',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema,
  async handler(options) {
    const { skip, take } = options.input.pagination

    return await prisma.ort.findMany({
      skip,
      take,
      where: await getWhere(options.input.filter, options.ctx.account),
      select: {
        id: true,
        name: true,
        address: true,
      },
    })
  },
})

export const ortCountProcedure = defineProcedure({
  key: 'count',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: inputSchema.pick({ filter: true }),
  async handler(options) {
    return await prisma.ort.count({
      where: await getWhere(options.input.filter, options.ctx.account),
    })
  },
})
