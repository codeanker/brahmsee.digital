import { Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const customFieldsGet = defineProtectedQueryProcedure({
  key: 'get',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    id: z.string().uuid(),
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
