import type { ActivityType, Role } from '@prisma/client'
import { TRPCError, initTRPC } from '@trpc/server'
import superjson from 'superjson'

import config from './config.js'
import { type Context } from './context.js'
import { logger } from './logger.js'
import { trpc_call_duration } from './metrics.js'
import logActivity from './util/activity.js'

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

  const causer = opts.ctx.authenticated ? opts.ctx.accountId : 'public'

  if (result.ok) logger.info(`[${causer}] ${meta.path}.${meta.type} [${durationMs}ms]`)
  else {
    const stack = config.loggingLevel === 'debug' ? result.error.stack : result.error.message
    // maybe dont log all errors
    logger.error(`[${causer}] ${meta.path}.${meta.type} [${durationMs}ms] ${stack}`)
  }
  return result
})

const logActivityMiddleware = middleware(async (opts) => {
  const result = await opts.next()

  if (result.ok) {
    let type: ActivityType | undefined = undefined
    const [subject, operation] = opts.path.split('.')

    if (operation == undefined) {
      type = 'OTHER'
    } else if (operation.endsWith('Create')) {
      type = 'CREATE'
    } else if (operation.endsWith('Patch')) {
      type = 'UPDATE'
    } else if (operation.endsWith('Remove')) {
      type = 'DELETE'
    }

    if (type !== undefined) {
      // const rawInput = opts.getRawInput() as { id: number }
      const resultData = result.data as { id?: string }
      const subjectId = type === 'CREATE' ? resultData?.id : '9999'
      if (subjectId) {
        logger.verbose(`Recording activity ${opts.path} of type ${type}`)
        await logActivity({
          subjectId,
          subjectType: subject || 'NO_SUBJECT',
          causerId: opts.ctx.authenticated ? opts.ctx.accountId : undefined,
          type,
        })
      }
    }
  }

  return result
})

const isAuthed = (roles: Role[]) =>
  t.middleware((opts) => {
    if (!opts.ctx.authenticated) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You are not allowed to access this resource`,
      })
    }

    if (!roles.includes(opts.ctx.account.role) && roles.length > 0) {
      // if roles is empty, the resource is public
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `You are not allowed to access this resource with "${opts.ctx.account.role}"`,
      })
    }

    return opts.next<AuthenticatedContext>({
      ...opts,
      ctx: opts.ctx,
    })
  })

export type AuthenticatedContext = Extract<Context, { authenticated: true }>

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
export const protectedProcedure = (roles: Role[]) =>
  t.procedure.use(loggerMiddleware).use(isAuthed(roles)).use(logActivityMiddleware)
