import { Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const customFieldsVeranstaltungDelete = defineProcedure({
  key: 'verwaltungDelete',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
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
