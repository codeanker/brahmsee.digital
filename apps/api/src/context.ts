import type { CreateTrpcKoaContextOptions } from 'trpc-koa-adapter'
import type { Simplify } from 'type-fest'

import type { Account, PrismaClient } from '@prisma/client'
import { getEntityIdFromHeader } from './authentication.js'
import { logger } from './logger.js'
import prisma from './prisma.js'

export async function createContext({ req }: CreateTrpcKoaContextOptions): Promise<Context> {
  const baseContext: BaseContext = {
    prisma,
  }

  try {
    const authorization = req.headers.authorization
    if (authorization === null) throw new Error('No authorization header found.')

    const accountIdFromHeader = getEntityIdFromHeader(authorization)
    if (accountIdFromHeader === undefined) {
      return {
        ...baseContext,

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
      ...baseContext,

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

export type BaseContext = {
  prisma: PrismaClient
}

export type AuthContext =
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

export type Context = Simplify<BaseContext & AuthContext>
