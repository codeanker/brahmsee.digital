import { Role } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const customFieldsDelete = defineProtectedMutateProcedure({
  key: 'delete',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    veranstaltungId: z.number(),
    fieldId: z.number(),
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

    const field = await prisma.customField.findUnique({
      where: {
        id: input.fieldId,
        veranstaltungId: input.veranstaltungId,
      },
    })

    if (field === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      })
    }

    await prisma.customField.delete({
      where: {
        id: input.fieldId,
        veranstaltungId: input.veranstaltungId,
      },
    })
  },
})
