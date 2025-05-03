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
      gliederung_name: z.string(),
      // gliederungId: z.number().int(),
      // veranstaltungId: z.number().int(),
    },
  }),
  handler: async ({ ctx, input: { filter, pagination } }) => {
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
        name: filter?.gliederung_name,
      },
      ...protection,
    }

    const total = await prisma.person.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, pagination)

    const persons = await prisma.person.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      orderBy: {
        lastname: 'asc',
      },
      where,
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
        anmeldungen: {
          select: {
            _count: true,
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
      every: {
        accountId: account.id,
      },
    }
  } else if (account.role === Role.GLIEDERUNG_ADMIN) {
    const gliederung = await getGliederungRequireAdmin(account.id)
    where.gliederungId = gliederung.id
  }

  return where
}
