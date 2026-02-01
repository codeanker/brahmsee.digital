import { Role, type Gliederung } from '@prisma/client'
import type { Context } from 'hono'
import { z } from 'zod'
import { getEntityIdFromHeader } from '../../authentication.js'
import prisma from '../../prisma.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'
import { zodSafe } from '../../util/zod.js'

export const sheetQuerySchema = z
  .object({
    jwt: z.string(),
    veranstaltungId: z.string().uuid().optional(),
    unterveranstaltungId: z.string().uuid().optional(),
  })
  .refine((data) => !!data.veranstaltungId || !!data.unterveranstaltungId, {
    message: 'Exactly one of veranstaltungId or unterveranstaltungId must be provided',
  })

export type SheetQuery = z.infer<typeof sheetQuerySchema>

export async function sheetAuthorize(ctx: Context) {
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
