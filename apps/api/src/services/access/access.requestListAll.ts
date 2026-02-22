import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

export const listAllGliederungAdminRequestsProcedure = defineProtectedQueryProcedure({
  key: 'listAllGliederungAdminRequests',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: defineTableInput({
    filter: {
      accountId: z.string().uuid(),
      gliederungId: z.string().uuid(),
      gliederung: z.string(),
      person: z.string(),
      confirmed: z.boolean(),
    },
    orderBy: ['gliederung_name'],
  }),
  handler: async ({ ctx, input: { pagination, filter, orderBy } }) => {
    let gliederungId: string | undefined = filter?.gliederungId
    if (ctx.account.role === 'GLIEDERUNG_ADMIN') {
      const gliederung = await getGliederungRequireAdmin(ctx.accountId)
      gliederungId = gliederung.id
    }

    const where: Prisma.GliederungToAccountWhereInput = {
      accountId: filter?.accountId,
      gliederungId,
      gliederung: {
        name: {
          contains: filter?.gliederung,
          mode: 'insensitive',
        },
      },
      confirmedByGliederung: filter?.confirmed,
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
        createdAt: true,
        confirmedAt: true,
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
            status: true,
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
