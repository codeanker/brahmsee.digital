import { z } from 'zod'

import { CustomFieldNames } from '../../enumMappings'
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
      type: z.enum(CustomFieldNames),
      required: z.boolean(),
      options: z.array(z.string()),
    }),
  }),
  async handler({ input }) {
    return await prisma.customField.create({
      data: {
        veranstaltungId: input.veranstaltungId,
        ...input.data,
      },
    })
  },
})
