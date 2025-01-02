import { z } from 'zod'

import { authenticationLogin } from '../../authentication.js'
import prisma from '../../prisma.js'
import { definePublicProcedure } from '../../types/defineProcedure.js'

export const authenticationLoginProcedure = definePublicProcedure({
  key: 'login',
  method: 'mutation',
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
        role: true,
        person: {
          select: {
            id: true,
            firstname: true,
            lastname: true,
            gliederungId: true,
          },
        },
        status: true,
      },
    })
    const person = account.person
    return {
      ...authResult,
      user: {
        ...authResult.user,
        person,
        role: account.role,
      },
    }
  },
})
