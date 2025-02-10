import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { defineQuery, getOrderBy } from '../../types/defineQuery.js'
import type { AuthenticatedContext } from '../../trpc.js'

const inputSchema = defineQuery({
  filter: z.strictObject({
    name: z.string().optional(),
    gliederungName: z.string().optional(),
  }),
  orderBy: z.array(
    z.tuple([
      z.union([z.literal('firstname'), z.literal('birthday'), z.literal('gliederung.name')]),
      z.union([z.literal('asc'), z.literal('desc')]),
    ])
  ),
})

type TInput = z.infer<typeof inputSchema>

export const personListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN, Role.USER],
  inputSchema,
  handler: ({ ctx, input }) => {
    const { skip, take } = input.pagination

    return prisma.person.findMany({
      skip,
      take,
      where: getWhere(input.filter, ctx),
      orderBy: getOrderBy(input.orderBy),
      select: {
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
        account: {
          select: {
            id: true,
            activatedAt: true,
            role: true,
            status: true,
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
        },
      },
    })
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
  const where: Prisma.PersonWhereInput = {}

  if (filter.name != null && filter.name != '') {
    where.OR = [{ firstname: { contains: filter.name } }, { lastname: { contains: filter.name } }]
  }
  if (filter.gliederungName != null && filter.gliederungName != '') {
    where.gliederung = {
      name: {
        contains: filter.gliederungName,
      },
    }
  }

  return {
    ...where,
    ...getPersonProtectionFilter(ctx),
  }
}
