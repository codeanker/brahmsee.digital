import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const programDeleteProcedure = defineProtectedMutateProcedure({
  key: 'delete',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    programId: z.string().uuid(),
  }),
  handler: async ({ input: { programId } }) => {
    await prisma.programmPunkt.delete({
      where: {
        id: programId,
      },
    })
  },
})
