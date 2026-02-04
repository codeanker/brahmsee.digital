import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'

export const accountPasswordResetValidateProcedure = definePublicQueryProcedure({
  key: 'validatePasswordResetToken',
  inputSchema: z.strictObject({
    token: z.string(),
  }),
  async handler({ input }) {
    const findRes = await prisma.account.findUnique({
      where: {
        passwordResetToken: input.token,
      },
      select: {
        id: true,
      },
    })

    return findRes !== null
  },
})
