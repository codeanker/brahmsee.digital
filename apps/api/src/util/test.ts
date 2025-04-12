import { AccountStatus, Role } from '@prisma/client'

import { authenticationLogin } from '../authentication.js'
import prisma from '../prisma.js'

import { hashPassword } from '@codeanker/authentication'
import { faker } from '@faker-js/faker'

export async function createMockAccountAdmin() {
  const runID = faker.string.nanoid(10)

  const accountPassword = runID
  const email = `log+${runID}@codeanker.de`
  const account = await prisma.account.create({
    data: {
      email,
      password: await hashPassword(accountPassword),
      activatedAt: new Date(),
      role: Role.ADMIN,
      person: {
        create: {
          firstname: 'e2e-admin',
          lastname: runID,
          email,
          telefon: '+49 123 4567890',
        },
      },
      status: AccountStatus.AKTIV,
    },
  })
  const { accessToken } = await authenticationLogin({
    email: account.email,
    password: runID,
  })

  return { account, accountPassword: runID, accessToken }
}

export async function cleanupAccount(email: string) {
  await prisma.person.deleteMany({
    where: {
      account: {
        email,
      },
    },
  })
}
