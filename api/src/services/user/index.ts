import { z } from 'zod'
import prisma from '../../prisma'
import { publicProcedure, router } from '../../trpc'
import { hashPassword } from '../authentication'

export const userRouter = router({
  create: publicProcedure
    .input(
      z.object({
        email: z.string(),
        firstname: z.string(),
        lastname: z.string(),
        role: z.enum(['GLIEDERUNG_ADMIN', 'ADMIN']),
        password: z.string(),
      })
    )
    .mutation(async (opts) => {
      const users = await prisma.user.create({
        data: {
          email: opts.input.email,
          firstname: opts.input.firstname,
          lastname: opts.input.lastname,
          role: opts.input.role,
          password: await hashPassword(opts.input.password),
        },
        select: {
          id: true,
        },
      })
      return users
    }),
  list: publicProcedure.query(async () => {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        role: true,
      },
    })
    return users
  }),
})
