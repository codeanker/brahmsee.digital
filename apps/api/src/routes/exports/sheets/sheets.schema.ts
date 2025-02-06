import { Role, type Gliederung } from '@prisma/client'
import type { Context } from 'koa'
import { z } from 'zod'
import { getEntityIdFromHeader } from '../../../authentication.js'
import prisma from '../../../prisma.js'
import { getGliederungRequireAdmin } from '../../../util/getGliederungRequireAdmin.js'
import { zodSafe } from '../../../util/zod.js'

export const sheetQuerySchema = z
  .object({
    jwt: z.string(),
    veranstaltungId: z.coerce.number().min(0).optional(),
    unterveranstaltungId: z.coerce.number().min(0).optional(),
  })
  .refine((data) => !!data.veranstaltungId || !!data.unterveranstaltungId, {
    message: 'Exactly one of veranstaltungId or unterveranstaltungId must be provided',
  })

export async function sheetAuthorize(ctx: Context) {
  const [success, query] = await zodSafe(sheetQuerySchema, ctx.query)
  if (!success) {
    ctx.response.status = 400
    return false
  }

  const accountId = getEntityIdFromHeader(`Bearer ${query.jwt}`)
  if (typeof accountId !== 'string') {
    ctx.response.status = 401
    return false
  }

  const accountIdNumber = parseInt(accountId)

  const account = await prisma.account.findUnique({
    where: {
      id: accountIdNumber,
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
    ctx.res.statusCode = 401
    return false
  }

  let gliederung: Gliederung | undefined = undefined
  if (account.role == Role.GLIEDERUNG_ADMIN) {
    try {
      gliederung = await getGliederungRequireAdmin(accountIdNumber)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      ctx.res.statusCode = 401
      return false
    }
  }

  return { query, account, gliederung }
}
