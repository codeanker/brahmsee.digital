import { ActivityType, Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import dayjs from 'dayjs'

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
        createdAt: z
          .tuple([z.date(), z.date()])
          .transform(([from, to]) => [dayjs(from).startOf('day').toDate(), dayjs(to).endOf('day').toDate()]),
        type: z.nativeEnum(ActivityType),
        subjectType: z.string(),
      })
      .partial()
      .optional(),
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
