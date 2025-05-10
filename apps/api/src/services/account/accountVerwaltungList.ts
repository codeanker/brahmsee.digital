import { AccountStatus, Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'

export const accountVerwaltungListProcedure = defineProtectedQueryProcedure({
  key: 'verwaltungList',
  roleIds: [Role.ADMIN],
  inputSchema: defineTableInput({
    filter: {
      name: z.string(),
      email: z.string(),
      status: z.nativeEnum(AccountStatus),
      role: z.nativeEnum(Role),
    },
  }),
  handler: async ({ input: { filter, pagination } }) => {
    const where: Prisma.AccountWhereInput = {
      email: filter?.email
        ? {
            contains: filter.email,
            mode: 'insensitive',
          }
        : undefined,
      status: filter?.status,
      role: filter?.role,
      OR: filter?.name
        ? [
            { person: { firstname: { contains: filter.name, mode: 'insensitive' } } },
            { person: { lastname: { contains: filter.name, mode: 'insensitive' } } },
          ]
        : undefined,
    }

    const total = await prisma.account.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, pagination)

    const accounts = await prisma.account.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      where,
      orderBy: {
        person: {
          lastname: 'asc',
        },
      },
      select: {
        id: true,
        email: true,
        activatedAt: true,
        status: true,
        role: true,
        personId: true,
        person: {
          select: {
            firstname: true,
            lastname: true,
            photoId: true,
          },
        },
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
    })

    return defineQueryResponse({ data: accounts, total, pagination: { pageIndex, pageSize, pages } })
  },
})
