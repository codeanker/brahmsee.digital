import { Role, type Prisma } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProcedure } from '../../types/defineProcedure.js'
import { defineQuery, getOrderBy } from '../../types/defineQuery.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

const inputSchema = defineQuery({
  filter: z.strictObject({
    veranstaltungId: z.number().optional(),
    gliederungId: z.number().optional(),
    gliederungName: z.string().optional(),
  }),
  orderBy: z.array(
    z.tuple([
      z.union([
        z.literal('id'),
        z.literal('veranstaltung.name'),
        z.literal('gliederung.name'),
        z.literal('meldeschluss'),
        z.literal('teilnahmegebuehr'),
      ]),
      z.union([z.literal('asc'), z.literal('desc')]),
    ])
  ),
})

type Input = z.infer<typeof inputSchema>

export const unterveranstaltungListProcedure = defineProcedure({
  key: 'list',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN] },
  inputSchema: inputSchema,
  async handler(options) {
    const { skip, take } = options.input.pagination
    const veranstaltungen = await prisma.unterveranstaltung.findMany({
      skip,
      take,
      where: await getWhere(options.input.filter, options.ctx.account),
      orderBy: getOrderBy(options.input.orderBy),
      select: {
        id: true,
        gliederung: {
          select: {
            id: true,
            name: true,
          },
        },
        veranstaltung: {
          select: {
            id: true,
            name: true,
            hostname: true,
          },
        },
        _count: {
          select: { Anmeldung: true },
        },
        meldebeginn: true,
        meldeschluss: true,
        maxTeilnehmende: true,
        teilnahmegebuehr: true,
      },
    })

    return veranstaltungen
  },
})

export const unterveranstaltungCountProcedure = defineProcedure({
  key: 'count',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN] },
  inputSchema: inputSchema.pick({ filter: true }),
  async handler(options) {
    const unterveranstaltungenCount = await prisma.unterveranstaltung.count({
      where: await getWhere(options.input.filter, options.ctx.account),
    })

    return unterveranstaltungenCount
  },
})

async function getWhere(
  filter: Input['filter'],
  account: {
    id: number
    role: Role
  }
): Promise<Prisma.UnterveranstaltungWhereInput> {
  const where: Prisma.UnterveranstaltungWhereInput = {}

  // Input-Filter
  if (filter.gliederungId !== undefined) where.gliederungId = filter.gliederungId
  if (filter.veranstaltungId !== undefined) where.veranstaltungId = filter.veranstaltungId
  if (filter.gliederungName !== undefined)
    where.gliederung = {
      name: {
        contains: filter.gliederungName,
      },
    }

  // Role-based Filter
  if (account.role !== Role.ADMIN) {
    const gliederung = await getGliederungRequireAdmin(account.id)
    where.gliederungId = gliederung.id
  }

  return where
}
