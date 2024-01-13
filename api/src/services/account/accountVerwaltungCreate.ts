import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { accountSchema, getAccountCreateData, sendMailConfirmEmailRequest } from './schema/account.schema'

export const accountVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: accountSchema,
  }),
  async handler(options) {
    const accountData = await getAccountCreateData(options.input.data)
    return prisma.account
      .create({
        data: accountData,
        select: {
          id: true,
        },
      })
      .then(() => {
        sendMailConfirmEmailRequest({
          email: accountData.email,
          activationToken: accountData.activationToken,
        })
      })
  },
})
