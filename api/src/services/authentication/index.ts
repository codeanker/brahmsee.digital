import { z } from 'zod'
import { publicProcedure, router } from '../../trpc'
import prisma from '../../prisma'
import { TRPCError } from '@trpc/server'
import { sign, verify } from 'jsonwebtoken'
import { hash, compare } from 'bcryptjs'
import * as config from 'config'

const jwtSecret: string = config.get('secret')

export const authenticationRouter = router({
  login: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
      })
    )
    .mutation(async (opts) => {
      const user = await prisma.user.findUnique({
        where: {
          email: opts.input.email,
        },
      })
      if (!user || !(await passwordMatches(user.password, opts.input.password))) {
        throw new TRPCError({
          code: 'UNAUTHORIZED',
          message: 'Email or password is incorrect',
        })
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user

      const accessToken = sign(
        {
          userId: user.id,
        },
        jwtSecret
      )

      return {
        accessToken,
        user: userWithoutPassword,
      }
    }),
  reAuthenticate: publicProcedure
    .input(
      z.object({
        accessToken: z.string(),
      })
    )
    .mutation(async (opts) => {
      try {
        const payload = verify(opts.input.accessToken, jwtSecret)
        if (payload === null || typeof payload !== 'object') throw new Error('Weird payload')

        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: {
            id: true,
            email: true,
          },
        })
        // TODO: check issued at
        if (user) {
          return { ok: true, user }
        } else {
          return { ok: false }
        }
      } catch (error) {
        // TODO: error handling
        return { ok: false }
      }
    }),
  logout: publicProcedure.mutation(async () => {
    return true
  }),
})

export function hashPassword(password: string) {
  return hash(password, 10)
}

async function passwordMatches(hash: string, password: string) {
  // find password in entity, this allows for dot notation

  if (!hash) return false
  return await compare(password, hash)
}
