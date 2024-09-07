import { Role } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { customFieldSchema } from './schema/customField.schema'

export const customFieldsUnterveranstaltungCreate = defineProcedure({
  key: 'unterveranstaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN] },
  inputSchema: z.strictObject({
    unterveranstaltungId: z.number(),
    data: customFieldSchema,
  }),
  handler: ({ input }) =>
    prisma.customField.create({
      data: {
        ...input.data,
        unterveranstaltungId: input.unterveranstaltungId,
      },
    }),
})
