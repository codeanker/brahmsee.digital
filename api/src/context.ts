import { type inferAsyncReturnType } from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'

import { getEntityIdFromHeader } from './authentication'
import { logger } from './logger'

export async function createContext({ req }: trpcNext.CreateNextContextOptions) {
  try {
    const userId = await getEntityIdFromHeader(req.headers.authorization)
    return {
      userId,
    }
  } catch (error) {
    logger.error(error)
    throw error
  }
}
export type Context = inferAsyncReturnType<typeof createContext>
