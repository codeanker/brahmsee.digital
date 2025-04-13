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
    include: {
      person: true,
    },
  })
  const { accessToken } = await authenticationLogin({
    email: account.email,
    password: runID,
  })

  return { account, accountPassword: runID, accessToken }
}

export async function createMockAccountGliederungAdmin() {
  const runID = faker.string.nanoid(10)

  const accountPassword = runID
  const email = `log+${runID}@codeanker.de`
  const account = await prisma.account.create({
    data: {
      email,
      password: await hashPassword(accountPassword),
      activatedAt: new Date(),
      role: Role.GLIEDERUNG_ADMIN,
      person: {
        create: {
          firstname: 'e2e-gliederung',
          lastname: runID,
          email,
          telefon: '+49 123 4567890',
        },
      },
      status: AccountStatus.AKTIV,
    },
    include: {
      person: true,
    },
  })
  const { accessToken } = await authenticationLogin({
    email: account.email,
    password: runID,
  })

  return { account, accountPassword: runID, accessToken }
}

export async function cleanupAccount(id: number) {
  await prisma.person.deleteMany({
    where: {
      account: {
        id,
      },
    },
  })
}

export async function getAccountByName({ firstname, lastname }: { firstname: string; lastname: string }) {
  const account = await prisma.account.findFirst({
    where: {
      person: {
        firstname,
        lastname,
      },
    },
  })
  return account
}

export async function getAccountById({ id }: { id: number }) {
  const account = await prisma.account.findFirst({
    where: {
      id,
    },
  })
  return account
}
