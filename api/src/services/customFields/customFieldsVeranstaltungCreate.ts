import { Role } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

import { customFieldSchema } from './schema/customField.schema.js'

export const customFieldsVeranstaltungCreate = defineProtectedProcedure({
  key: 'veranstaltungCreate',
  method: 'mutation',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    veranstaltungId: z.number(),
    data: customFieldSchema,
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
