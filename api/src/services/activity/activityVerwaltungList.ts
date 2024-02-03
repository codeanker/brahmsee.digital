import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const activityVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      veranstaltungId: z.string().optional(),
    }),
  }),
  async handler({ input }) {
    const { skip, take } = input.pagination

    const activities = await prisma.activity.findMany({
      skip,
      take,
      orderBy: {
        timestamp: 'desc',
      },
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
