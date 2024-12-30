import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from "../../prisma.js"
import { defineProcedure } from "../../types/defineProcedure.js"
import { defineQuery, getOrderBy } from "../../types/defineQuery.js"

const inputSchema = defineQuery({
  filter: z.strictObject({
    personName: z.string().optional(),
    email: z.string().optional(),
    status: z.enum(['AKTIV', 'DEAKTIVIERT', 'OFFEN']).optional(),
  }),

  orderBy: z.array(
    z.tuple([
      z.union([z.literal('person.firstname'), z.literal('email'), z.literal('role'), z.literal('status')]),
      z.union([z.literal('asc'), z.literal('desc')]),
    ])
  ),
})

export const accountVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema,
  async handler(options) {
    const { skip, take } = options.input.pagination
    const list = await prisma.account.findMany({
      skip,
      take,
      where: await getWhere(options.input.filter, options.ctx.account),
      orderBy: getOrderBy(options.input.orderBy),
      select: {
        id: true,
        email: true,
        activatedAt: true,
        status: true,
        role: true,
        personId: true,
        person: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
        GliederungToAccount: {
          select: {
            role: true,
            gliederung: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    })
    return list
  },
})

export const accountVerwaltungCountProcedure = defineProcedure({
  key: 'verwaltungCount',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: inputSchema.pick({ filter: true }),
  async handler(options) {
    const list = await prisma.account.count({
      where: await getWhere(options.input.filter, options.ctx.account),
    })
    return list
  },
})

async function getWhere(filter: z.infer<typeof inputSchema>['filter'], _account: { id: number; role: Role }) {
  const where: Prisma.AccountWhereInput = {}

  if (filter.email != null && filter.email != '')
    where.email = {
      contains: filter.email,
    }

  if (filter.personName != null && filter.personName != '')
    where.OR = [
      { person: { firstname: { contains: filter.personName } } },
      { person: { lastname: { contains: filter.personName } } },
    ]

  if (filter.status != null) where.status = filter.status

  return where
}
