import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const accountVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      email: z.string().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const list = await prisma.account.findMany({
      skip,
      take,
      where: {
        email: options.input.filter.email,
      },
      select: {
        id: true,
        email: true,
        activatedAt: true,
        status: true,
        role: true,
        personId: true,
        person: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
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
    })
    return list
  },
})
