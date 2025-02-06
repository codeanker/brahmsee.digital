import { Role } from '@prisma/client'
import z from 'zod'

import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'

import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest.js'

export const accountEmailConfirmRequestProcedure = defineProtectedQueryProcedure({
  key: 'emailConfirmRequest',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    accountId: z.number().int(),
  }),
  async handler({ ctx, input }) {
    const account = await ctx.prisma.account.findUnique({
      where: {
        id: input.accountId,
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
      subjectId: input.accountId,
      causerId: ctx.accountId,
      description: 'email confirmation requested',
    })

    await sendMailConfirmEmailRequest(ctx, {
      email: account.email,
      activationToken: account.activationToken,
    })

    return {
      success: true,
    }
  },
})
