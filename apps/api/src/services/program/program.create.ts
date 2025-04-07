import { TRPCError } from '@trpc/server'
import dayjs from 'dayjs'
import { z } from 'zod'
import client from '../../prisma.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'

export const programCreateProcedure = definePublicMutateProcedure({
  key: 'create',
  inputSchema: z.strictObject({
    veranstaltungId: z.number().int(),
    name: z.string(),
    description: z.string(),
    location: z.string(),
    responsible: z.string(),
    startingAt: z.date(),
    endingAt: z.date(),
  }),
  handler: async ({ input }) => {
    if (dayjs(input.endingAt).isBefore(input.startingAt)) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Das Enddatum kann nicht vor dem Startdatum liegen.',
      })
    }

    await client.programmPunkt.create({
      data: input,
    })
  },
})
