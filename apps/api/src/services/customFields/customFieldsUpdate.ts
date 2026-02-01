import { Role } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

import { TRPCError } from '@trpc/server'
import { customFieldSchema } from './schema/customField.schema.js'

export const customFieldsUpdate = defineProtectedMutateProcedure({
  key: 'update',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    fieldId: z.string().uuid(),
    data: customFieldSchema,
  }),
  async handler({ ctx, input }) {
    if (ctx.account.role === Role.GLIEDERUNG_ADMIN) {
      const { gliederungId: gliederungIdActor } = await prisma.person.findFirstOrThrow({
        where: {
          account: {
            id: ctx.accountId,
          },
        },
        select: {
          gliederungId: true,
        },
      })
      const customField = await prisma.customField.findUniqueOrThrow({
        where: {
          id: input.fieldId,
        },
        select: {
          unterveranstaltung: {
            select: {
              gliederungId: true,
            },
          },
        },
      })
      if (gliederungIdActor !== customField.unterveranstaltung?.gliederungId) {
        throw new TRPCError({
          code: 'NOT_FOUND',
        })
      }
    }

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
