import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'

export const accountEmailConfirmProcedure = definePublicMutateProcedure({
  key: 'emailConfirm',
  inputSchema: z.strictObject({
    activationToken: z.string(),
  }),
  async handler(options) {
    const account = await prisma.account.findUnique({
      where: {
        activationToken: options.input.activationToken,
      },
      select: {
        id: true,
        role: true,
        activatedAt: true,
      },
    })

    if (!account) {
      return {
        status: 'InvalidLink',
      }
    }

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        status: account.role === 'USER' ? 'AKTIV' : 'OFFEN',
        activatedAt: new Date(),
        activationToken: null,
      },
    })

    return {
      status: 'AccountActivated',
    }
  },
})
