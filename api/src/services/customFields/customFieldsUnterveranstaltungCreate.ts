import { Role } from '@prisma/client'
import { z } from 'zod'

import prisma from "../../prisma.js"
import { defineProcedure } from "../../types/defineProcedure.js"

import { customFieldSchema } from "./schema/customField.schema.js"

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
