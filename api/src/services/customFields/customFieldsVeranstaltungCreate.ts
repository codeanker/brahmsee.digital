import { Role } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

import { customFieldSchema } from './schema/customField.schema.js'
import templates from './schema/templates.js'
import { TRPCError } from '@trpc/server'

export const customFieldsVeranstaltungCreate = defineProtectedMutateProcedure({
  key: 'veranstaltungCreate',
  roleIds: [Role.ADMIN],
  inputSchema: z.discriminatedUnion('type', [
    z.strictObject({
      type: z.literal('new'),
      veranstaltungId: z.number(),
      data: customFieldSchema,
    }),
    z.strictObject({
      type: z.literal('fromTemplate'),
      veranstaltungId: z.number(),
      template: z.string(),
    }),
  ]),
  handler: ({ input }) => {
    if (input.type === 'new') {
      return prisma.customField.create({
        data: {
          ...input.data,
          veranstaltungId: input.veranstaltungId,
        },
      })
    }

    const template = templates[input.template]
    if (template === undefined) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No template named ${input.template}`,
      })
    }

    return prisma.customField.create({
      data: {
        ...template,
        veranstaltungId: input.veranstaltungId,
      },
    })
  },
})
