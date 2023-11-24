import config from './config'
import prisma from './prisma'

import { createAuthentication } from '@codeanker/authentication'

export const { getEntityIdFromHeader, authenticationLogin, sign } = createAuthentication({
  jwtSecret: config.authentication.secret,
  expiresIn: config.authentication.expiresIn,
  async getEnityByEmail(email) {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    })
    if (user.password === null) throw new Error('User has no password')
    return {
      id: user.id,
      password: user.password,
    }
  },
})
