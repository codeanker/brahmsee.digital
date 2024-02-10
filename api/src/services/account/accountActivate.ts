import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import logActivity from '../../util/activity'
import { sendMail } from '../../util/mail'

export const accountActivateProcedure = defineProcedure({
  key: 'activate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    accountId: z.number().int(),
  }),
  async handler(options) {
    const account = await prisma.account.update({
      where: {
        id: options.input.accountId,
      },
      data: {
        activatedAt: new Date(),
      },
    })

    await logActivity({
      type: 'UPDATE',
      description: `account was activated`,
      subjectType: 'account',
      subjectId: options.input.accountId,
      causerId: options.ctx.accountId,
    })

    await sendMail({
      to: account.email,
      subject: 'brahmsee.digital Account aktiviert',
      categories: ['account', 'activate'],
      html: 'Dein brahmsee.digital Account wurde aktiviert.',
    })

    return 'activated'
  },
})
