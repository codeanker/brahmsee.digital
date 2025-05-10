import { z } from 'zod'
import { defineOrderBy } from '../../types/defineOrderBy.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import client from '../../prisma.js'
import { Role, Prisma } from '@prisma/client'
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
])

type FilterSchema = z.infer<typeof filterSchema>

function getWhere(ctx: Context, filter: FilterSchema): Prisma.AnmeldungLinkWhereInput {
  if (filter.type === 'veranstaltung') {
    return {
      unterveranstaltung: {
        veranstaltungId: filter.veranstaltungId,
      },
    }
  } else if (filter.type === 'unterveranstaltung') {
    return {
      unterveranstaltungId: filter.unterveranstaltungId,
    }
  }
  throw new Error('Invalid filter type')
}

export const anmeldungLinkListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
  inputSchema: z.strictObject({
    pagination: ZPaginationSchema,
    filter: filterSchema,
    orderBy: defineOrderBy(['usedAt', 'createdBy', 'comment']),
  }),
  async handler({ ctx, input }) {
    const { skip, take } = input.pagination
    const result = await client.anmeldungLink.findMany({
      skip,
      take,
      where: getWhere(ctx, input.filter),
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        createdAt: true,
        usedAt: true,
        comment: true,
        accessToken: true,
        createdBy: {
          select: {
            person: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        anmeldung: {
          select: {
            id: true,
            createdAt: true,
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

    return result
  },
})

export const anmeldungLinkCountProcedure = defineProtectedQueryProcedure({
  key: 'count',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
  inputSchema: z.strictObject({
    filter: filterSchema,
  }),
  handler: ({ ctx, input }) => {
    return client.anmeldungLink.count({
      where: getWhere(ctx, input.filter),
    })
  },
})
