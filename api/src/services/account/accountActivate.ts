import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import { sendMail } from '../../util/mail'

export const accountActivateProcedure = defineProcedure({
  key: 'activate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: z.strictObject({
      accountId: z.number().int(),
    }),
  }),
  async handler(options) {
    prisma.account
      .update({
        where: {
          id: options.input.data.accountId,
        },
        data: {
          activatedAt: new Date(),
        },
      })
      .then((res) => {
        sendMail({
          to: res.email,
          subject: 'brahmsee.digital Account aktiviert',
          categories: ['account', 'activate'],
          data: {
            account: res,
          },
          html: 'Dein brahmsee.digital Account wurde aktiviert.',
        })
      })

    return 'activated'
  },
})
