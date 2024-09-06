import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const personVerwaltungListProcedure = defineProcedure({
  key: 'verwaltungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
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
            id: true,
            name: true,
          },
        },
        account: {
          select: {
            id: true,
            activatedAt: true,
            role: true,
            status: true,
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
        },
      },
    })
    return list
  },
})
