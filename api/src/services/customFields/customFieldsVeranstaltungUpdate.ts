import { Role } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { customFieldSchema } from './schema/customField.schema'

export const customFieldsVeranstaltungUpdate = defineProcedure({
  key: 'veranstaltungUpdate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: z.strictObject({
    fieldId: z.number(),
    data: customFieldSchema,
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
