import { z } from 'zod'

import { CustomFieldNames } from '../../enumMappings'
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
      type: z.enum(CustomFieldNames),
      required: z.boolean(),
      options: z.array(z.string()),
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
