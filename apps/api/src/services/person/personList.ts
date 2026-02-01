import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import type { AuthenticatedContext } from '../../trpc.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

export const personListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN, Role.USER],
  inputSchema: defineTableInput({
    filter: {
      name: z.string(),
      birthday: z.array(z.date()).min(2).max(2),
      gliederung_name: z.string(),
      // gliederungId: z.string().uuid(),
      // veranstaltungId: z.string().uuid(),
    },
    orderBy: ['birthday', 'anmeldungen__count'],
  }),
  handler: async ({ ctx, input: { filter, orderBy, pagination } }) => {
    const protection = await getPersonProtectionFilter(ctx)
    const where: Prisma.PersonWhereInput = {
      OR: filter?.name
        ? [
            {
              firstname: {
                contains: filter.name,
                mode: 'insensitive',
              },
            },
            {
              lastname: {
                contains: filter.name,
                mode: 'insensitive',
              },
            },
          ]
        : undefined,
      gliederung: {
        name: {
          contains: filter?.gliederung_name,
          mode: 'insensitive',
        },
      },
      birthday:
        filter?.birthday === undefined
          ? undefined
          : {
              gte: filter.birthday[0],
              lte: filter.birthday[1],
            },
      ...protection,
    }

    const total = await prisma.person.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, pagination)

    console.log(orderBy)

    const persons = await prisma.person.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      where,
      orderBy,
      select: {
        id: true,
        firstname: true,
        lastname: true,
        birthday: true,
        photoId: true,
        gliederung: {
          select: {
            name: true,
          },
        },
        account: {
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            anmeldungen: true,
          },
        },
        anmeldungen: {
          select: {
            unterveranstaltung: {
              select: {
                veranstaltung: {
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

    return defineQueryResponse({ data: persons, total, pagination: { pageIndex, pageSize, pages } })
  },
})

export async function getPersonProtectionFilter({
  account,
}: AuthenticatedContext): Promise<Prisma.PersonWhereInput | Prisma.PersonWhereUniqueInput> {
  const where: Prisma.PersonWhereInput = {}

  if (account.role === Role.USER) {
    where.anmeldungen = {
      some: {
        accountId: account.id,
      },
    }
  } else if (account.role === Role.GLIEDERUNG_ADMIN) {
    const gliederung = await getGliederungRequireAdmin(account.id)
    where.gliederungId = gliederung.id
  }

  return where
}
