import { Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { defineQuery } from '../../types/defineQuery'

export const personGliederungListProcedure = defineProcedure({
  key: 'gliederungList',
  method: 'query',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.GLIEDERUNG_ADMIN] },
  inputSchema: defineQuery({
    filter: z.strictObject({
      firstname: z.string().optional(),
      lastname: z.string().optional(),
    }),
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
      include: {
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
