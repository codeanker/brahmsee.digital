import { z } from 'zod'
import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

export const programListProcedure = definePublicQueryProcedure({
  key: 'list',
  inputSchema: z.strictObject({
    veranstaltungId: z.number().int(),
  }),
  handler: ({ input }) =>
    prisma.programmPunkt.findMany({
      where: {
        veranstaltungId: input.veranstaltungId,
      },
      select: {
        name: true,
        description: true,
        location: true,
        responsible: true,
        startingAt: true,
        endingAt: true,
      },
      orderBy: {
        startingAt: 'asc',
      },
    }),
})
