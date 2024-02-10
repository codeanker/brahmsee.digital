import { type inferAsyncReturnType } from '@trpc/server'
import type { CreateTrpcKoaContextOptions } from 'trpc-koa-adapter'

import { getEntityIdFromHeader } from './authentication'
import { logger } from './logger'

export async function createContext({ req }: CreateTrpcKoaContextOptions) {
  try {
    const accountId = await getEntityIdFromHeader(req.headers.authorization)
    return {
      accountId: typeof accountId === 'string' ? parseInt(accountId) : accountId,
    }
  } catch (error) {
    logger.error(error)
    throw error
  }
}
export type Context = inferAsyncReturnType<typeof createContext>
