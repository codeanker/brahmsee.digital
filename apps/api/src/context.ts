import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

import type { Account } from '@prisma/client'
import { getEntityIdFromHeader } from './authentication.js'
import { logger } from './logger.js'
import prisma from './prisma.js'

function getAuthorizationHeader(headers: FetchCreateContextFnOptions['req']['headers']) {
  if ('authorization' in headers && typeof headers['authorization'] === 'string') {
    return headers['authorization']
  } else {
    return headers.get('authorization')
  }
}

export async function createContext({ req }: FetchCreateContextFnOptions): Promise<Context> {
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
    const account = await prisma.account.findFirstOrThrow({
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
