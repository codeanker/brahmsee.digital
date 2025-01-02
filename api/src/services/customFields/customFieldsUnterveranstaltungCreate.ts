import { Role } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'

import { customFieldSchema } from './schema/customField.schema.js'

export const customFieldsUnterveranstaltungCreate = defineProtectedProcedure({
  key: 'unterveranstaltungCreate',
  method: 'mutation',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
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
