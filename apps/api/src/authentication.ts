import config from './config.js'
import prisma from './prisma.js'

import { createAuthentication } from '@codeanker/authentication'

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

    if (account === null) {
      throw new Error('Es konnte kein Account gefunden werden.')
    }
    if (account.status !== 'AKTIV') {
      throw new Error('Dein Account ist nicht aktiviert. Bitte prüfe dein E-Mail Postfach, ob du den Account noch aktivieren musst. Wende dich ansonsten an deine Gliederung.')
    }
    if (account.password === null) {
      throw new Error('Der Account hat kein Passwort, wahrscheinlich hast du dich über das ISC angemeldet.')
    }

    return {
      id: account.id,
      password: account.password,
    }
  },
})
