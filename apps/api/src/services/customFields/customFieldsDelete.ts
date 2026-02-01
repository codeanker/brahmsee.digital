import { Role } from '@prisma/client'
import { z } from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { TRPCError } from '@trpc/server'

export const customFieldsVeranstaltungDelete = defineProtectedMutateProcedure({
  key: 'veranstaltungDelete',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    veranstaltungId: z.string().uuid(),
    fieldId: z.string().uuid(),
  }),
  async handler({ input }) {
    await prisma.customField.delete({
      where: {
        id: input.fieldId,
        veranstaltungId: input.veranstaltungId,
      },
    })
  },
})

export const customFieldsUnterveranstaltungDelete = defineProtectedMutateProcedure({
  key: 'unterveranstaltungDelete',
  roleIds: [Role.ADMIN, Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    unterveranstaltungId: z.string().uuid(),
    fieldId: z.string().uuid(),
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

    await prisma.customField.delete({
      where: {
        id: input.fieldId,
      },
    })
  },
})
