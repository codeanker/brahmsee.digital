import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export const programListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    veranstaltungId: z.string().uuid(),
  }),
  handler: ({ input }) =>
    prisma.programmPunkt.findMany({
      where: {
        veranstaltungId: input.veranstaltungId,
      },
      select: {
        id: true,
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
