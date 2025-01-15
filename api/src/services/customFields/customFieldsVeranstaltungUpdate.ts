import { Role } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

import { customFieldSchema } from './schema/customField.schema.js'

export const customFieldsVeranstaltungUpdate = defineProtectedMutateProcedure({
  key: 'veranstaltungUpdate',
  roleIds: [Role.ADMIN],
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
