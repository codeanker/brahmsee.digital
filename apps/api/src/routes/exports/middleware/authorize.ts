import type { Context } from 'hono'
import { createMiddleware } from 'hono/factory'
import { zodSafe } from '../../../util/zod.js'
import { sheetQuerySchema } from '../sheets.schema.js'
import { getEntityIdFromHeader } from '../../../authentication.js'
import prisma from '../../../prisma.js'
import { Role, type Gliederung } from '@prisma/client'
import { getGliederungRequireAdmin } from '../../../util/getGliederungRequireAdmin.js'

export type AuthorizeResults = Exclude<Awaited<ReturnType<typeof sheetAuthorize>>, false>

export const authorize = createMiddleware<{
  Variables: AuthorizeResults
}>(async (ctx, next) => {
  const authorization = await sheetAuthorize(ctx)
  if (!authorization) {
    return ctx.text('Unauthorized', 401)
  }

  const { query, account, gliederung } = authorization

  ctx.set('query', query)
  ctx.set('account', account)
  ctx.set('gliederung', gliederung)

  await next()
})

async function sheetAuthorize(ctx: Context) {
  const [success, query] = await zodSafe(sheetQuerySchema, ctx.req.query())
  if (!success) {
    ctx.status(400)
    return false
  }

  const accountId = getEntityIdFromHeader(`Bearer ${query.jwt}`)
  if (typeof accountId !== 'string') {
    ctx.status(401)
    return false
  }

  const account = await prisma.account.findUnique({
    where: {
      id: accountId,
    },
    select: {
      role: true,
      person: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  })

  if (account == null) {
    ctx.status(401)
    return false
  }

  let gliederung: Gliederung | undefined = undefined
  if (account.role == Role.GLIEDERUNG_ADMIN) {
    try {
      gliederung = await getGliederungRequireAdmin(accountId)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      ctx.status(401)
      return false
    }
  }

  return { query, account, gliederung }
}
