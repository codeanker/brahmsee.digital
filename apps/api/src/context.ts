import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import type { CreateTrpcKoaContextOptions } from 'trpc-koa-adapter'

import { getEntityIdFromHeader } from './authentication.js'
import { logger } from './logger.js'
import client from './prisma.js'
import type { Account } from '@prisma/client'

function getAuthorizationHeader(
  headers: CreateTrpcKoaContextOptions['req']['headers'] | FetchCreateContextFnOptions['req']['headers']
) {
  if ('authorization' in headers && typeof headers['authorization'] === 'string') {
    return headers['authorization']
  } else {
    return (headers as FetchCreateContextFnOptions['req']['headers']).get('authorization')
  }
}

export async function createContext({
  req,
}: CreateTrpcKoaContextOptions | FetchCreateContextFnOptions): Promise<Context> {
  try {
    const authorization = getAuthorizationHeader(req.headers)
    if (authorization === null) throw new Error('No authorization header found.')

    const accountIdFromHeader = getEntityIdFromHeader(authorization)
    if (accountIdFromHeader === undefined) {
      return {
        authenticated: false,
        account: undefined,
        accountId: undefined,
      }
    }

    const accountId = parseInt(accountIdFromHeader)
    const account = await client.account.findFirstOrThrow({
      where: {
        id: accountId,
      },
    })

    return {
      authenticated: true,
      accountId,
      account,
    }
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message)
    } else {
      logger.error('An unknown error occurred')
    }
    throw error
  }
}

type AuthContext =
  | {
      authenticated: false
      accountId: undefined
      account: undefined
    }
  | {
      authenticated: true
      accountId: number
      account: Account
    }

export type Context = AuthContext
