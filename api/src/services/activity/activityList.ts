import { type Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProtectedProcedure } from '../../types/defineProcedure'
import { defineQuery, getOrderBy } from '../../types/defineQuery'

const inputSchema = defineQuery({
  filter: z.strictObject({
    veranstaltungId: z.string().optional(),
  }),
  orderBy: z.array(
    z.tuple([z.union([z.literal('id'), z.literal('createdAt')]), z.union([z.literal('asc'), z.literal('desc')])])
  ),
})

type Input = z.infer<typeof inputSchema>

export const activityListProcedure = defineProtectedProcedure({
  key: 'list',
  method: 'query',
  roleIds: [Role.ADMIN],
  inputSchema,
  async handler({ input, ctx }) {
    const { skip, take } = input.pagination

    const activities = await prisma.activity.findMany({
      skip,
      take,
      orderBy: getOrderBy(input.orderBy),
      where: await getWhere(input.filter, ctx.account),
      include: {
        causer: {
          select: {
            person: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
      },
    })

    return activities
  },
})

export const activityCountProcedure = defineProtectedProcedure({
  key: 'count',
  method: 'query',
  roleIds: [Role.ADMIN],
  inputSchema: inputSchema.pick({ filter: true }),
  async handler({ input, ctx }) {
    const activities = await prisma.activity.count({
      where: await getWhere(input.filter, ctx.account),
    })

    return activities
  },
})

async function getWhere(
  _filter: Input['filter'],
  _account: {
    id: number
    role: Role
  }
): Promise<Prisma.ActivityWhereInput> {
  return {}
}
