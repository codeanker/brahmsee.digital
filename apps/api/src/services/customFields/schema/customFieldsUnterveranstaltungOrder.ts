import z from 'zod'
import { defineProtectedMutateProcedure } from '../../../types/defineProcedure.js'
import { getGliederungRequireAdmin } from '../../../util/getGliederungRequireAdmin.js'
import { TRPCError } from '@trpc/server'
import prisma from '../../../prisma.js'

export const customFieldUnterveranstaltungOrder = defineProtectedMutateProcedure({
  key: 'unterveranstaltungOrder',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.strictObject({
    unterveranstaltungId: z.uuid(),
    fields: z.array(z.uuid()),
  }),
  handler: async ({ ctx, input }) => {
    if (ctx.account.role === 'GLIEDERUNG_ADMIN') {
      const gliederung = await getGliederungRequireAdmin(ctx.accountId)
      if (gliederung.id !== input.unterveranstaltungId) {
        throw new TRPCError({
          code: 'FORBIDDEN',
        })
      }
    }

    const fields = await prisma.customField.findMany({
      where: {
        unterveranstaltungId: input.unterveranstaltungId,
        id: {
          in: input.fields,
        },
      },
    })

    if (fields.length !== input.fields.length) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Some supplied fields do not belong to the given unterveranstaltung!',
      })
    }

    await prisma.$transaction(
      input.fields.map((field, index) =>
        prisma.customField.update({
          where: {
            unterveranstaltungId: input.unterveranstaltungId,
            id: field,
          },
          data: {
            order: index + 1,
          },
        })
      )
    )
  },
})
