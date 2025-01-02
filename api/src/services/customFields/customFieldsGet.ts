import { Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

export const customFieldsGet = defineProtectedProcedure({
  key: 'get',
  method: 'query',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    id: z.number(),
  }),
  async handler({ input }) {
    const field = await prisma.customField.findUnique({
      where: {
        id: input.id,
      },
    })

    if (field === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      })
    }

    return field
  },
})
