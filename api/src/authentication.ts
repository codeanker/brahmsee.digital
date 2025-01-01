import config from './config.js'
import prisma from './prisma.js'

import { createAuthentication } from '@codeanker/authentication'

// eslint-disable-next-line @typescript-eslint/unbound-method
export const { getEntityIdFromHeader, authenticationLogin, sign } = createAuthentication({
  jwtSecret: config.authentication.secret,
  expiresIn: config.authentication.expiresIn,
  async getEnityByEmail(email) {
    const account = await prisma.account.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
        status: true,
        activationToken: true,
      },
    })
    if (account === null) throw new Error('Es konnte kein Account gefunden werden.')
    if (account.activationToken !== null)
      throw new Error('Account noch nicht bestätigt, bitte bestätige deine E-Mail-Adresse.')
    if (account.status !== 'AKTIV') throw new Error('Account ist nicht Aktiv.')
    if (account.password === null) throw new Error('Account has no password')
    return {
      id: account.id,
      password: account.password,
    }
  },
})
