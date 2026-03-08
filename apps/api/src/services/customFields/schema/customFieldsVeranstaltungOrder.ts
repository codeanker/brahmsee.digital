import { TRPCError } from '@trpc/server'
import z from 'zod'
import prisma from '../../../prisma.js'
import { defineProtectedMutateProcedure } from '../../../types/defineProcedure.js'

export const customFieldVeranstaltungOrder = defineProtectedMutateProcedure({
  key: 'veranstaltungOrder',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    veranstaltungId: z.string().uuid(),
    fields: z.array(z.string().uuid()),
  }),
  handler: async ({ input }) => {
    const fields = await prisma.customField.findMany({
      where: {
        veranstaltungId: input.veranstaltungId,
        id: {
          in: input.fields,
        },
      },
    })

    if (fields.length !== input.fields.length) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Some supplied fields do not belong to the given veranstaltung!',
      })
    }

    await prisma.$transaction(
      input.fields.map((field, index) =>
        prisma.customField.update({
          where: {
            veranstaltungId: input.veranstaltungId,
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
