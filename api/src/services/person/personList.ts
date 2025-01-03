import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { defineQuery, getOrderBy } from '../../types/defineQuery.js'

const inputSchema = defineQuery({
  filter: z.strictObject({
    name: z.string().optional(),
    gliederungName: z.string().optional(),
  }),
  orderBy: z.array(
    z.tuple([
      z.union([z.literal('firstname'), z.literal('birthday'), z.literal('gliederung.name')]),
      z.union([z.literal('asc'), z.literal('desc')]),
    ])
  ),
})

type TInput = z.infer<typeof inputSchema>

export const personListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN],
  inputSchema,
  async handler(options) {
    const { skip, take } = options.input.pagination
    const list = await prisma.person.findMany({
      skip,
      take,
      where: await getWhere(options.input.filter, options.ctx.account),
      orderBy: getOrderBy(options.input.orderBy),
      include: {
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
        account: {
          select: {
            id: true,
            activatedAt: true,
            role: true,
            status: true,
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
        },
      },
    })
    return list
  },
})

export const personCountProcedure = defineProtectedQueryProcedure({
  key: 'count',
  roleIds: [Role.ADMIN],
  inputSchema: inputSchema.pick({ filter: true }),
  async handler(options) {
    const total = await prisma.person.count({
      where: await getWhere(options.input.filter, options.ctx.account),
    })
    return total
  },
})

// eslint-disable-next-line @typescript-eslint/require-await
async function getWhere(
  filter: TInput['filter'],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _account: {
    id: number
    role: Role
  }
): Promise<Prisma.PersonWhereInput> {
  const where: Prisma.PersonWhereInput = {}

  if (filter.name != null && filter.name != '') {
    where.OR = [{ firstname: { contains: filter.name } }, { lastname: { contains: filter.name } }]
  }
  if (filter.gliederungName != null && filter.gliederungName != '') {
    where.gliederung = {
      name: {
        contains: filter.gliederungName,
      },
    }
  }
  return where
}
