import { type inferAsyncReturnType } from '@trpc/server'
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import type { CreateTrpcKoaContextOptions } from 'trpc-koa-adapter'

import { getEntityIdFromHeader } from './authentication'
import { logger } from './logger'

function getAuthorizationHeader(
  headers: CreateTrpcKoaContextOptions['req']['headers'] | FetchCreateContextFnOptions['req']['headers']
) {
  if ('authorization' in headers && typeof headers['authorization'] === 'string') {
    return headers['authorization']
  } else {
    return (headers as FetchCreateContextFnOptions['req']['headers']).get('authorization')
  }
}

export async function createContext({ req }: CreateTrpcKoaContextOptions | FetchCreateContextFnOptions) {
  try {
    const authorization = getAuthorizationHeader(req.headers)
    if (authorization === null) throw new Error('No authorization header found.')

    const accountId = await getEntityIdFromHeader(authorization)
    return {
      accountId: typeof accountId === 'string' ? parseInt(accountId) : accountId,
    }
  } catch (error) {
    logger.error(error)
    throw error
  }
}
export type Context = inferAsyncReturnType<typeof createContext>
