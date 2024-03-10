import { CustomFieldType } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const customFieldsVeranstaltungUpdate = defineProcedure({
  key: 'verwaltungUpdate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    fieldId: z.number(),
    data: z.strictObject({
      name: z.string().min(1),
      description: z.string().nullable(),
      type: z.nativeEnum(CustomFieldType),
      required: z.boolean(),
    }),
  }),
  async handler({ input }) {
    return await prisma.customField.update({
      where: {
        id: input.fieldId,
      },
      data: {
        ...input.data,
      },
    })
  },
})
