import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import logActivity from '../../util/activity'

export const accountVerwaltungRemoveProcedure = defineProcedure({
  key: 'verwaltungRemove',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
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
      .then((account) => {
        logActivity({
          type: 'DELETE',
          subjectType: 'account',
          subjectId: account.id,
          description: 'Account gelöscht',
        })
        return account
      })
  },
})
