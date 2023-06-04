import { z } from 'zod'
import prisma from '../../prisma'
import { publicProcedure, router } from '../../trpc'

export const userRouter = router({
  create: publicProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async (opts) => {
      const users = await prisma.user.create({
        data: opts.input,
      })
      return users
    }),
  list: publicProcedure.query(async () => {
    const users = await prisma.user.findMany()
    return users
  }),
})
