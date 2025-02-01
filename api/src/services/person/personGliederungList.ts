import { Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import { defineQuery } from '../../types/defineQuery.js'

export const personGliederungListProcedure = defineProtectedQueryProcedure({
  key: 'gliederungList',
  roleIds: [Role.GLIEDERUNG_ADMIN],
  inputSchema: defineQuery({
    filter: z.strictObject({
      firstname: z.string().optional(),
      lastname: z.string().optional(),
    }),
    orderBy: z.array(
      z.tuple([
        z.union([z.literal('id'), z.literal('firstname'), z.literal('lastname')]),
        z.union([z.literal('asc'), z.literal('desc')]),
      ])
    ),
  }),
  async handler(options) {
    if (typeof options.ctx.account.person.gliederungId !== 'number') {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Du bist noch keiner Gliederung zugeordnet!',
      })
    }

    const { skip, take } = options.input.pagination

    const list = await prisma.person.findMany({
      skip,
      take,
      where: {
        firstname: options.input.filter.firstname,
        lastname: options.input.filter.lastname,
        gliederungId: options.ctx.account.person.gliederungId,
      },
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
      },
    })
    return list
  },
})
