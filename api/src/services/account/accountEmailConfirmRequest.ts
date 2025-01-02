import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'

import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest.js'

export const accountEmailConfirmRequestProcedure = defineProtectedProcedure({
  key: 'emailConfirmRequest',
  method: 'mutation',
  roleIds: [Role.ADMIN],
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

    await logActivity({
      type: 'OTHER',
      subjectType: 'account',
      subjectId: options.input.accountId,
      causerId: options.ctx.accountId,
      description: 'email confirmation requested',
    })

    await sendMailConfirmEmailRequest(account.email, account.activationToken)

    return {
      success: true,
    }
  },
})
