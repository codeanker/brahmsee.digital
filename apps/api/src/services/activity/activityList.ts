import { ActivityType, Prisma, Role } from '@prisma/client'
import z from 'zod'

import dayjs from 'dayjs'
import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'

export const activityListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN],
  inputSchema: defineTableInput({
    filter: {
      createdAt: z
        .tuple([z.date(), z.date()])
        .transform(([from, to]) => [dayjs(from).startOf('day').toDate(), dayjs(to).endOf('day').toDate()]),
      type: z.nativeEnum(ActivityType),
      subjectType: z.string(),
    },
  }),
  handler: async ({ input: { pagination, filter } }) => {
    const where: Prisma.ActivityWhereInput = {
      createdAt: filter?.createdAt
        ? {
            gte: filter.createdAt[0],
            lte: filter.createdAt[1],
          }
        : undefined,
      type: filter?.type,
      subjectType: filter?.subjectType,
    }

    const total = await prisma.activity.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, pagination)

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

    return defineQueryResponse({ data: activities, total, pagination: { pageIndex, pageSize, pages } })
  },
})

export const activityCompleteSubjectsProcedure = defineProtectedQueryProcedure({
  key: 'listSubjectTypes',
  inputSchema: z.void(),
  roleIds: [Role.ADMIN],
  handler: async () => {
    const result = await prisma.activity.findMany({
      distinct: ['subjectType'],
      select: {
        subjectType: true,
      },
    })

    return result.map((r) => r.subjectType)
  },
})
