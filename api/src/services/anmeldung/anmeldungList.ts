import { AnmeldungStatus, Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineOrderBy } from '../../types/defineOrderBy.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { ZPaginationSchema } from '../../types/defineQuery.js'
import type { Context } from '../../context.js'

const filterSchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('veranstaltung'),
    veranstaltungId: z.number(),
  }),
  z.strictObject({
    type: z.literal('unterveranstaltung'),
    unterveranstaltungId: z.number(),
  }),
  z.strictObject({
    type: z.literal('own'),
  })
])

type FilterSchema = z.infer<typeof filterSchema>

function getWhere(ctx: Context, filter: FilterSchema): Prisma.AnmeldungWhereInput {
  if (filter.type === 'veranstaltung') {
    return {
      unterveranstaltung: {
        veranstaltungId: filter.veranstaltungId,
      },
    }
  }
  else if (filter.type === 'unterveranstaltung') {
    return {
      unterveranstaltungId: filter.unterveranstaltungId,
    }
  }

  return {
    accountId: ctx.accountId,
  }
}

export const anmeldungListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
  inputSchema: z.strictObject({
    pagination: ZPaginationSchema,
    filter: filterSchema,
    orderBy: defineOrderBy(['status', 'createdBy']),
  }),
  async handler({ ctx, input }) {
    const { skip, take } = input.pagination
    const anmeldungen = await prisma.anmeldung.findMany({
      skip,
      take,
      where: getWhere(ctx, input.filter),
      select: {
        id: true,
        person: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            photoId: true,
            birthday: true,
            gliederung: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        status: true,
        unterveranstaltung: {
          select: {
            veranstaltung: {
              select: {
                meldeschluss: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return anmeldungen
  },
})

export const anmeldungCountProcedure = defineProtectedQueryProcedure({
  key: 'count',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
  inputSchema: z.strictObject({
    filter: filterSchema,
  }),
  async handler({ ctx, input }) {
    const countEntries = await Promise.all(
      Object.values(AnmeldungStatus).map(async (status) => {
        return [
          status,
          await prisma.anmeldung.count({
            where: {
              ...getWhere(ctx, input.filter),
              status: status,
            },
          }),
        ]
      })
    )

    const total = countEntries.reduce((acc, [, count]) => acc + Number(count), 0)
    return { total, ...Object.fromEntries(countEntries) } as Record<AnmeldungStatus, number> & { total: number }
  },
})
