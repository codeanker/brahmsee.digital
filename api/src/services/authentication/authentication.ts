import { z } from 'zod'

import { authenticationLogin } from '../../authentication'
import prisma from '../../prisma'
import { router, publicProcedure } from '../../trpc'

const ZAuthenticateLoginInputSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export const authenticationRouter = router({
  login: publicProcedure.input(ZAuthenticateLoginInputSchema).mutation(async ({ input }) => {
    const authResult = await authenticationLogin(input)
    const person = await prisma.person.findFirstOrThrow({
      where: {
        account: {
          id: authResult.user.id,
        },
      },
      select: {
        id: true,
        firstname: true,
        lastname: true,
      },
    })
    return {
      ...authResult,
      user: {
        ...authResult.user,
        person,
      },
    }
  }),
})
