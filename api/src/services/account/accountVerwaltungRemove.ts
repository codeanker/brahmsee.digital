import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'

export const accountVerwaltungRemoveProcedure = defineProcedure({
  key: 'verwaltungRemove',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: [Role.ADMIN] },
  inputSchema: z.strictObject({
    id: z.number().int(),
  }),
  async handler(options) {
    return await prisma.account
      .delete({
        where: {
          id: options.input.id,
        },
      })
      .then(async (account) => {
        await logActivity({
          type: 'DELETE',
          subjectType: 'account',
          subjectId: account.id,
          description: 'Account gelöscht',
        })
        return account
      })
  },
})
