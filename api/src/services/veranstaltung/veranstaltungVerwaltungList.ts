import { Prisma, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'
import { defineQuery, getOrderBy } from '../../types/defineQuery.js'

const inputSchema = defineQuery({
  filter: z.strictObject({
    name: z.string().optional(),
  }),
  orderBy: z.array(
    z.tuple([
      z.union([
        z.literal('id'),
        z.literal('name'),
        z.literal('maxTeilnehmende'),
        z.literal('teilnahmegebuehr'),
        z.literal('beginn'),
        z.literal('meldeschluss'),
      ]),
      z.union([z.literal('asc'), z.literal('desc')]),
    ])
  ),
})

type TInput = z.infer<typeof inputSchema>

export const veranstaltungVerwaltungListProcedure = defineProtectedProcedure({
  key: 'verwaltungList',
  method: 'query',
  roleIds: [Role.ADMIN],
  inputSchema,
  async handler(options) {
    const { skip, take } = options.input.pagination
    const veranstaltungen = await prisma.veranstaltung.findMany({
      skip,
      take,
      where: await getWhere(options.input.filter, options.ctx.account),
      orderBy: getOrderBy(options.input.orderBy),
      select: {
        id: true,
        name: true,
        beginn: true,
        ende: true,
        ort: {
          select: {
            name: true,
            id: true,
          },
        },
        meldebeginn: true,
        meldeschluss: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
        unterveranstaltungen: {
          select: {
            id: true,
            maxTeilnehmende: true,
            teilnahmegebuehr: true,
            meldebeginn: true,
            meldeschluss: true,
            gliederungId: true,
            _count: {
              select: {
                Anmeldung: {
                  where: {
                    status: {
                      equals: 'BESTAETIGT',
                    },
                  },
                },
              },
            },
          },
        },
        hostname: {
          select: {
            id: true,
            hostname: true,
          },
        },
      },
    })

    return veranstaltungen
  },
})

export const veranstaltungVerwaltungCountProcedure = defineProtectedProcedure({
  key: 'verwaltungCount',
  method: 'query',
  roleIds: [Role.ADMIN],
  inputSchema: inputSchema.pick({ filter: true }),
  async handler(options) {
    return await prisma.veranstaltung.count({
      where: await getWhere(options.input.filter, options.ctx.account),
    })
  },
})

// eslint-disable-next-line @typescript-eslint/require-await
async function getWhere(
  filter: TInput['filter'],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _account: {
    id: number
    role: Role
  }
): Promise<Prisma.VeranstaltungWhereInput> {
  const where: Prisma.VeranstaltungWhereInput = {}

  if (filter.name != undefined && filter.name != '') {
    where.name = {
      contains: filter.name,
    }
  }

  return where
}
