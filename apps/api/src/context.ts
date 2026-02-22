import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
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

function getAccountById(accountId: string) {
  return prisma.account.findFirst({
    where: {
      id: accountId,
    },
    select: {
      id: true,
      activatedAt: true,
      email: true,
      role: true,
      status: true,
      GliederungToAccount: {
        select: {
          confirmedByGliederung: true,
          role: true,
        },
      },
      person: {
        select: {
          firstname: true,
          lastname: true,
        },
      },
    },
  })
}

export async function createContext({ req }: FetchCreateContextFnOptions): Promise<Context> {
  try {
    const authorization = getAuthorizationHeader(req.headers)
    if (authorization === null) throw new Error('No authorization header found.')

    const accountId = getEntityIdFromHeader(authorization)
    if (accountId === undefined) {
      return {
        authenticated: false,
        account: undefined,
        accountId: undefined,
      }
    }

    const account = await getAccountById(accountId)

    if (account === null) {
      return {
        authenticated: false,
        accountId: undefined,
        account: undefined,
      }
    }

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
      accountId: string
      account: NonNullable<Awaited<ReturnType<typeof getAccountById>>>
    }

export type Context = AuthContext
