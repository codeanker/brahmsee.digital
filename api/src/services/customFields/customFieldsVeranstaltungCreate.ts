import { CustomFieldPosition, CustomFieldType } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const customFieldsVeranstaltungCreate = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    veranstaltungId: z.number(),
    data: z.strictObject({
      name: z.string().min(1),
      description: z.string().nullable(),
      type: z.nativeEnum(CustomFieldType),
      required: z.boolean(),
      options: z.array(z.string()),
      positions: z.nativeEnum(CustomFieldPosition).array(),
    }),
  }),
  async handler({ input }) {
    return await prisma.customField.create({
      data: {
        ...input.data,
        veranstaltungId: input.veranstaltungId,
      },
    })
  },
})
