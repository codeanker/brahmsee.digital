import type { Role } from '@prisma/client'
import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'

import { type Context } from './context'
import { logger } from './logger'
import { trpc_call_duration } from './metrics'
import prisma from './prisma'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const middleware = t.middleware
const loggerMiddleware = middleware(async (opts) => {
  const start = Date.now()
  const result = await opts.next()
  const durationMs = Date.now() - start
  const meta = { path: opts.path, type: opts.type, durationMs }

  trpc_call_duration.observe(
    {
      path: meta.path,
    },
    durationMs
  )

  if (result.ok) logger.info(`[${opts.ctx.userId ?? 'public'}] ${meta.path}.${meta.type} [${durationMs}ms]`)
  else {
    // maybe dont log all errors
    logger.error(`[${opts.ctx.userId ?? 'public'}] ${meta.path}.${meta.type} [${durationMs}ms] ${result.error.stack}`)
  }
  return result
})

const isAuthed = (roles: Role[]) =>
  t.middleware(async (opts) => {
    const { ctx } = opts
    if (ctx.userId === undefined) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: parseInt(ctx.userId) },
      select: {
        id: true,
        role: true,
      },
    })
    if (!roles.includes(user.role) && roles.length > 0) {
      // if roles is empty, the resource is public
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You are not allowed to access this resource "${roles}" with "${user.role}"`,
      })
    }
    return opts.next({
      ctx: {
        user: user,
        userId: ctx.userId,
      },
    })
  })

export const router = t.router
export const mergeRouters = t.mergeRouters

/**
/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure.use(loggerMiddleware)

/**
 * Protected (authed) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use
 * this. It verifies the session is valid and guarantees ctx.session.user is not
 * null
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = (roles: Role[]) => t.procedure.use(loggerMiddleware).use(isAuthed(roles))
