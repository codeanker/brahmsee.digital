import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const programGetProcedure = defineProtectedMutateProcedure({
  key: 'get',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    programId: z.string().uuid(),
  }),
  handler: async ({ input }) => {
    return await prisma.programmPunkt.findUniqueOrThrow({
      where: {
        id: input.programId,
      },
      select: {
        name: true,
        description: true,
        location: true,
        responsible: true,
        startingAt: true,
        endingAt: true,
      },
    })
  },
})
