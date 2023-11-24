import { z } from 'zod'

import { authenticationLogin } from '../../authentication'
import { router, publicProcedure } from '../../trpc'

const ZAuthenticateLoginInputSchema = z.object({
  email: z.string(),
  password: z.string(),
})

export const authenticationRouter = router({
  login: publicProcedure.input(ZAuthenticateLoginInputSchema).mutation(async ({ input }) => {
    return authenticationLogin(input)
  }),
})
