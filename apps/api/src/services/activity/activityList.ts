import { ActivityType, Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const activityListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    pagination: z
      .strictObject({
        pageIndex: z.number().min(0),
        pageSize: z.number().min(1).max(50),
      })
      .optional(),
    filter: z
      .strictObject({
        type: z.nativeEnum(ActivityType),
      })
      .partial()
      .optional(),
  }),
  handler: async ({ input: { pagination, filter } }) => {
    const where: Prisma.ActivityWhereInput = {
      type: filter?.type,
    }

    const total = await prisma.activity.count({ where })

    const pageIndex = pagination?.pageIndex ?? 0
    const pageSize = pagination?.pageSize ?? 50
    const pages = Math.ceil(total / pageSize)

    const activities = await prisma.activity.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      orderBy: {
        createdAt: 'desc',
      },
      where,
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

    return {
      data: activities,
      total,
      pagination: {
        page: pageIndex,
        pages,
        hasNextPage: pageIndex < pages - 1,
        hasPreviousPage: pageIndex > 0,
      },
    }
  },
})
