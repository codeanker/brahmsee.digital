import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const anmeldungEmailConfirmProcedure = defineProcedure({
  key: 'emailConfirm',
  method: 'mutation',
  protection: { type: 'public' },
  inputSchema: z.strictObject({
    activationTokens: z.array(z.string()),
  }),
  async handler(options) {
    const account = await prisma.account.findUnique({
      where: {
        activationToken: options.input.activationTokens[0],
      },
      select: {
        id: true,
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
        activatedAt: new Date(),
        activationToken: null,
      },
    })

    const anmeldung = await prisma.anmeldung.findUnique({
      where: {
        activationToken: options.input.activationTokens[1],
      },
      select: {
        id: true,
        activatedAt: true,
      },
    })

    if (!anmeldung) {
      return {
        status: 'InvalidLink',
      }
    }

    await prisma.anmeldung.update({
      where: {
        id: account.id,
      },
      data: {
        activatedAt: new Date(),
        status: 'OFFEN',
        activationToken: null,
      },
    })

    return {
      status: 'AccountActivated',
    }
  },
})
