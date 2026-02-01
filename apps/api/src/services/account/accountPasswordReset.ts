import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'

import { hashPassword } from '@codeanker/authentication'

export const accountPasswordResetProcedure = definePublicMutateProcedure({
  key: 'resetPassword',
  inputSchema: z.strictObject({
    token: z.string(),
    password: z.string(),
  }),
  async handler({ input }) {
    const findRes = await prisma.account.findUnique({
      where: {
        passwordResetToken: input.token,
      },
      select: {
        id: true,
        passwordResetToken: true,
      },
    })

    if (findRes == null)
      return {
        status: true,
      }

    await prisma.account.update({
      where: {
        id: findRes.id,
      },
      data: {
        password: await hashPassword(input.password),
        passwordResetToken: null,
      },
    })
  },
})
