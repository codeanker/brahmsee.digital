import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

import { accountSchema, getAccountCreateData } from './schema/account.schema'

export const accountVerwaltungCreateProcedure = defineProcedure({
  key: 'verwaltungCreate',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    data: accountSchema,
  }),
  async handler(options) {
    return prisma.account.create({
      data: await getAccountCreateData(options.input.data),
      select: {
        id: true,
      },
    })
  },
})
