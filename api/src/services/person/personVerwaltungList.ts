import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const personVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      firstname: z.string().optional(),
      lastname: z.string().optional(),
    }),
  }),
  async handler(options) {
    const { skip, take } = options.input.pagination
    const list = await prisma.person.findMany({
      skip,
      take,
      where: {
        firstname: options.input.filter.firstname,
        lastname: options.input.filter.lastname,
      },
      include: {
        gliederung: {
          select: {
            name: true,
          },
        },
        account: {
          select: {
            id: true,
            role: true,
            GliederungToAccount: {
              select: {
                role: true,
              },
            },
          },
        },
      },
    })
    return list
  },
})
