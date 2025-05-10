import { Role, type Prisma } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'

export const ortListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN],
  inputSchema: defineTableInput({
    filter: {
      name: z.string().optional(),
    },
  }),
  async handler({ input: { pagination, filter } }) {
    const where: Prisma.OrtWhereInput = {
      name: {
        contains: filter?.name,
        mode: 'insensitive',
      },
    }

    const total = await prisma.ort.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, pagination)

    const orte = await prisma.ort.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      orderBy: {
        name: 'asc',
      },
      where,
      select: {
        id: true,
        name: true,
        address: {
          select: {
            zip: true,
            country: true,
            city: true,
            street: true,
            streetNumber: true,
          },
        },
      },
    })

    return defineQueryResponse({ data: orte, total, pagination: { pageIndex, pageSize, pages } })
  },
})
