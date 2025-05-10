import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'

export const gliederungListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN],
  inputSchema: defineTableInput({
    filter: {
      name: z.string().optional(),
      edv: z.string().optional(),
    },
  }),
  async handler({ input: { pagination, filter } }) {
    const where: Prisma.GliederungWhereInput = {
      name: {
        contains: filter?.name,
        mode: 'insensitive',
      },
      edv: filter?.edv,
    }

    const total = await prisma.gliederung.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, pagination)

    const orte = await prisma.gliederung.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      orderBy: {
        name: 'asc',
      },
      where,
      select: {
        name: true,
        edv: true,
      },
    })

    return defineQueryResponse({ data: orte, total, pagination: { pageIndex, pageSize, pages } })
  },
})
