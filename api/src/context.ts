import { type inferAsyncReturnType } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

import { getEntityIdFromHeader } from './authentication'
import { logger } from './logger'

export async function createContext({ req }: trpcNext.CreateNextContextOptions) {
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
