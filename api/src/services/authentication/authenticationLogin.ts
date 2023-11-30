import { z } from 'zod'

import { authenticationLogin } from '../../authentication'
import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'

export const authenticationLoginProcedure = defineProcedure({
  key: 'login',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
  inputSchema: z.strictObject({
    email: z.string(),
    password: z.string(),
  }),
  async handler(options) {
    const authResult = await authenticationLogin(options.input)
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        id: authResult.user.id,
      },
      select: {
        person: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    })
    const person = account.person
    return {
      ...authResult,
      user: {
        ...authResult.user,
        person,
      },
    }
  },
})
