import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from "../../prisma.js"
import { defineProcedure } from "../../types/defineProcedure.js"
import { defineQuery, getOrderBy } from "../../types/defineQuery.js"

const inputSchema = defineQuery({
  filter: z.strictObject({
    edv: z.string().optional(),
    name: z.string().optional(),
  }),
  orderBy: z.array(
    z.tuple([z.union([z.literal('edv'), z.literal('name')]), z.union([z.literal('asc'), z.literal('desc')])])
  ),
})
type TInput = z.infer<typeof inputSchema>

export const gliederungListProcedure = defineProcedure({
  key: 'list',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema,
  async handler(options) {
    const { skip, take } = options.input.pagination
    const list = await prisma.gliederung.findMany({
      skip,
      take,
      orderBy: getOrderBy(options.input.orderBy),
      where: await getWhere(options.input.filter, options.ctx.account),
      select: {
        id: true,
        name: true,
        edv: true,
      },
    })

    return list
  },
})

export const gliederungCountProcedure = defineProcedure({
  key: 'count',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: inputSchema.pick({ filter: true }),
  async handler(options) {
    const list = await prisma.gliederung.count({
      where: await getWhere(options.input.filter, options.ctx.account),
    })

    return list
  },
})

async function getWhere(
  filter: TInput['filter'],
  _account: {
    id: number
    role: Role
  }
): Promise<Prisma.GliederungWhereInput> {
  const where: Prisma.GliederungWhereInput = {}

  if (filter.name != undefined && filter.name !== '')
    where.name = {
      contains: filter.name,
      mode: 'insensitive',
    }

  if (filter.edv != undefined && filter.edv !== '')
    where.edv = {
      contains: filter.edv,
      mode: 'insensitive',
    }

  return where
}
