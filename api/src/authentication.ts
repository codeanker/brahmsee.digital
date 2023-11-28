import config from './config'
import prisma from './prisma'

import { createAuthentication } from '@codeanker/authentication'

export const { getEntityIdFromHeader, authenticationLogin, sign } = createAuthentication({
  jwtSecret: config.authentication.secret,
  expiresIn: config.authentication.expiresIn,
  async getEnityByEmail(email) {
    const account = await prisma.account.findUniqueOrThrow({
      where: {
        email,
        activatedAt: {
          not: null,
        },
      },
      select: {
        id: true,
        password: true,
      },
    })
    if (account.password === null) throw new Error('Account has no password')
    return {
      id: account.id,
      password: account.password,
    }
  },
})
