import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest.js'
import { accountSchema, getAccountCreateData } from './schema/account.schema.js'

export const accountVerwaltungCreateProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungCreate',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    data: accountSchema,
  }),
  async handler({ ctx, input }) {
    const accountData = await getAccountCreateData(input.data)
    if (typeof accountData.activationToken !== 'string') {
      throw new Error('no activation token found!')
    }

    const res = prisma.account.create({
      data: accountData,
      select: {
        id: true,
      },
    })

    await sendMailConfirmEmailRequest(ctx, {
      activationToken: accountData.activationToken,
      email: accountData.email,
    })

    return res
  },
})
