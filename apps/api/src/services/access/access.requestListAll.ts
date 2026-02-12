import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'

export const listAllGliederungAdminRequestsProcedure = defineProtectedQueryProcedure({
  key: 'listAllGliederungAdminRequests',
  roleIds: ['ADMIN'],
  inputSchema: defineTableInput({
    filter: {
      gliederung: z.string().optional(),
      person: z.string().optional(),
    },
    orderBy: ['gliederung.name'],
  }),
  handler: async ({ input: { pagination, filter, orderBy } }) => {
    const where: Prisma.GliederungToAccountWhereInput = {
      confirmedByGliederung: false,
      gliederung: {
        name: {
          contains: filter?.gliederung,
          mode: 'insensitive',
        },
      },
      OR: [
        {
          account: {
            person: {
              firstname: {
                contains: filter?.person,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          account: {
            person: {
              lastname: {
                contains: filter?.person,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    }

    const total = await prisma.gliederungToAccount.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, pagination)

    const requests = await prisma.gliederungToAccount.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      where,
      orderBy,
      select: {
        id: true,
        gliederungId: true,
        confirmedByGliederung: true,
        gliederung: {
          select: {
            name: true,
          },
        },
        account: {
          select: {
            id: true,
            email: true,
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

    return defineQueryResponse({ data: requests, total, pagination: { pageIndex, pageSize, pages } })
  },
})
