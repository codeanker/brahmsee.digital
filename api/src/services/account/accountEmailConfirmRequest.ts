import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest'

export const accountEmailConfirmRequestProcedure = defineProcedure({
  key: 'emailConfirmRequest',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    accountId: z.number().int(),
  }),
  async handler(options) {
    const account = await prisma.account.findUnique({
      where: {
        id: options.input.accountId,
      },
      select: {
        id: true,
        email: true,
        activationToken: true,
        activatedAt: true,
      },
    })
    if (!account || account.email == undefined || account.activationToken == undefined) {
      return {
        error: 'NoAccountFound',
      }
    }
    if (account.activatedAt) {
      return {
        error: 'AccountAlreadyActivated',
      }
    }
    sendMailConfirmEmailRequest({
      email: account.email,
      activationToken: account.activationToken,
    })
    return {
      success: true,
    }
  },
})
