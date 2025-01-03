import { Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const customFieldsVeranstaltungDelete = defineProtectedMutateProcedure({
  key: 'veranstaltungDelete',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    veranstaltungId: z.number(),
    fieldId: z.number(),
  }),
  async handler({ input }) {
    const field = await prisma.customField.findUnique({
      where: {
        id: input.fieldId,
        veranstaltungId: input.veranstaltungId,
      },
    })

    if (field === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      })
    }

    await prisma.customField.delete({
      where: {
        id: input.fieldId,
        veranstaltungId: input.veranstaltungId,
      },
    })
  },
})
