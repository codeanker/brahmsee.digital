import { AnmeldungStatus, Prisma, Role } from '@prisma/client'
import z from 'zod'

import type { Context } from '../../context.js'
import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { calculatePagination, defineQueryResponse, defineTableInput } from '../../types/defineTableProcedure.js'

const scopeSchema = z.discriminatedUnion('type', [
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
  }),
])

type ScopeSchema = z.infer<typeof scopeSchema>

function getScope(ctx: Context, filter: ScopeSchema): Prisma.AnmeldungWhereInput {
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

  return {
    accountId: ctx.accountId,
  }
}

export const anmeldungListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
  inputSchema: defineTableInput({
    filter: {
      scope: scopeSchema,
      person: z.string(),
      gliederung: z.string(),
      status: z.nativeEnum(AnmeldungStatus),
      withoutPhoto: z.boolean(),
    },
  }),
  async handler({ ctx, input: { filter, pagination } }) {
    const where: Prisma.AnmeldungWhereInput = {
      ...getScope(ctx, filter?.scope ?? { type: 'own' }),
      person: {
        OR: filter?.person
          ? [
              {
                firstname: {
                  contains: filter?.person,
                  mode: 'insensitive',
                },
              },
              {
                lastname: {
                  contains: filter?.person,
                  mode: 'insensitive',
                },
              },
            ]
          : undefined,
        photoId: filter?.withoutPhoto
          ? {
              equals: null,
            }
          : undefined,
        gliederung: {
          name: {
            contains: filter?.gliederung,
            mode: 'insensitive',
          },
        },
      },
      status: filter?.status,
    }

    const total = await prisma.anmeldung.count({ where })
    const { pageIndex, pageSize, pages } = calculatePagination(total, pagination)

    const anmeldungen = await prisma.anmeldung.findMany({
      take: pageSize,
      skip: pageSize * pageIndex,
      orderBy: {
        createdAt: 'desc',
      },
      where,
      select: {
        id: true,
        createdAt: true,
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
    })

    return defineQueryResponse({ data: anmeldungen, total, pagination: { pageIndex, pageSize, pages } })
  },
})

export const anmeldungCountProcedure = defineProtectedQueryProcedure({
  key: 'count',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN, Role.USER],
  inputSchema: z.strictObject({
    filter: scopeSchema,
  }),
  async handler({ ctx, input }) {
    const countEntries = await Promise.all(
      Object.values(AnmeldungStatus).map(async (status) => {
        return [
          status,
          await prisma.anmeldung.count({
            where: {
              ...getScope(ctx, input.filter),
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
