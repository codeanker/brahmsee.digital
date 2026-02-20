import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const programEditProcedure = defineProtectedMutateProcedure({
  key: 'edit',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    programId: z.string().uuid(),
    data: z.object({
      name: z.string(),
      description: z.string(),
      location: z.string(),
      responsible: z.string(),
      startingAt: z.date(),
      endingAt: z.date(),
    }),
  }),
  handler: async ({ input: { programId, data } }) => {
    if (dayjs(data.endingAt).isBefore(data.startingAt)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Das Enddatum kann nicht vor dem Startdatum liegen.',
      })
    }

    await prisma.programmPunkt.update({
      where: {
        id: programId,
      },
      data: data,
    })
  },
})
