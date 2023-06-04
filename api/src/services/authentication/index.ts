import { z } from 'zod'
import { publicProcedure, router } from '../../trpc'

export const authenticationRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async () => {
      return {
        user: null,
      }
    }),
  reAuthenticate: publicProcedure.mutation(async () => {
    return {
      user: null,
    }
  }),
  logout: publicProcedure.mutation(async () => {
    return true
  }),
})
