import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import type { AuthenticatedContext } from '../../trpc.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { getOrderBy } from '../../types/defineQuery.js'

const inputSchema = z.strictObject({
  filter: z
    .strictObject({
      name: z.string(),
      'gliederung.name': z.string(),
    })
    .partial(),
  orderBy: z.array(
    z.tuple([
      z.union([z.literal('firstname'), z.literal('birthday'), z.literal('gliederung.name')]),
      z.union([z.literal('asc'), z.literal('desc')]),
    ])
  ),
  pagination: z.strictObject({
    page: z.number().int().min(1),
    perPage: z.number().int().min(1),
  }),
})

type TInput = z.infer<typeof inputSchema>

export const personListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN, Role.USER],
  inputSchema,
  handler: async ({ ctx, input }) => {
    const { page, perPage } = input.pagination

    const total = await prisma.person.count({
      where: getWhere(input.filter, ctx),
    })

    const data = await prisma.person.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      where: getWhere(input.filter, ctx),
      orderBy: getOrderBy(input.orderBy),
      select: {
        _count: {
          select: {
            anmeldungen: true,
          },
        },
        id: true,
        firstname: true,
        lastname: true,
        birthday: true,
        photoId: true,
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    const pages = Math.ceil(total / perPage)

    return {
      data,
      page,
      pages,
      total,
    }
  },
})

export const personCountProcedure = defineProtectedQueryProcedure({
  key: 'count',
  roleIds: [Role.ADMIN, Role.USER],
  inputSchema: inputSchema.pick({ filter: true }),
  async handler(options) {
    const total = await prisma.person.count({
      where: getWhere(options.input.filter, options.ctx),
    })
    return total
  },
})

export function getPersonProtectionFilter({
  account,
}: AuthenticatedContext): Prisma.PersonWhereInput | Prisma.PersonWhereUniqueInput {
  const where: Prisma.PersonWhereInput = {}

  if (account.role === Role.USER) {
    where.anmeldungen = {
      every: {
        accountId: account.id,
      },
    }
  }

  return where
}

function getWhere(filter: TInput['filter'], ctx: AuthenticatedContext): Prisma.PersonWhereInput {
  const where: Prisma.PersonWhereInput = {
    account: null,
  }

  if (filter.name) {
    where.OR = [
      { firstname: { contains: filter.name, mode: 'insensitive' } },
      { lastname: { contains: filter.name, mode: 'insensitive' } },
    ]
  }
  // if (filter.gliederungN) {
  //   where.gliederung = {
  //     name: {
  //       contains: filter.gliederungName,
  //     },
  //   }
  // }

  return {
    ...where,
    ...getPersonProtectionFilter(ctx),
  }
}
