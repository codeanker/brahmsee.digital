import { Prisma, Role } from '@prisma/client'
import { z } from 'zod'
import type { Context } from '../../context.js'
import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'

const filterSchema = z.discriminatedUnion('type', [
  z.strictObject({
    type: z.literal('veranstaltung'),
    veranstaltungId: z.string().uuid(),
  }),
  z.strictObject({
    type: z.literal('unterveranstaltung'),
    unterveranstaltungId: z.string().uuid(),
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
    section: filterSchema,
    table: defineTableInput({
      filter: {
        status: z.enum(['used', 'unused']),
      },
    }),
  }),
  async handler({ ctx, input }) {
    const where: Prisma.AnmeldungLinkWhereInput = {
      ...getWhere(ctx, input.section),
    }
    if (input.table.filter?.status === 'used') {
      where.NOT = [{ usedAt: null }]
    } else if (input.table.filter?.status === 'unused') {
      where.usedAt = null
    }

    const total = await prisma.anmeldungLink.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, input.table.pagination)

    const result = await prisma.anmeldungLink.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      where,
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
        unterveranstaltung: {
          select: {
            id: true,
            gliederung: {
              select: {
                name: true,
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

    return defineQueryResponse({ data: result, total, pagination: { pageIndex, pageSize, pages } })
  },
})
