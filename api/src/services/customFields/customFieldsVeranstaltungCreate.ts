import { Role } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { customFieldSchema } from './schema/customField.schema'

export const customFieldsVeranstaltungCreate = defineProcedure({
  key: 'veranstaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
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
