import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProtectedProcedure } from '../../types/defineProcedure'

import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest'
import { accountSchema, getAccountCreateData } from './schema/account.schema'

export const accountVerwaltungCreateProcedure = defineProtectedProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    data: accountSchema,
  }),
  async handler(options) {
    const accountData = await getAccountCreateData(options.input.data)
    if (typeof accountData.activationToken !== 'string') {
      throw new Error('no activation token found!')
    }

    const res = prisma.account.create({
      data: accountData,
      select: {
        id: true,
      },
    })

    await sendMailConfirmEmailRequest(accountData.email, accountData.activationToken)

    return res
  },
})
