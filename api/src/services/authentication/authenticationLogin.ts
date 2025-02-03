import { z } from 'zod'

import { authenticationLogin } from '../../authentication.js'
import prisma from '../../prisma.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import { personSelfSelect } from '../person/personAuthenticatedGet.js'

export const authenticationLoginProcedure = definePublicMutateProcedure({
  key: 'login',
  inputSchema: z.strictObject({
    email: z.string(),
    password: z.string(),
  }),
  async handler({ input }) {
    const { accessToken, user } = await authenticationLogin(input)
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        id: user.id,
      },
      select: personSelfSelect,
    })

    return {
      accessToken,
      account,
    }
  },
})
