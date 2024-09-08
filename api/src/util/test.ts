import { AccountStatus, Role } from '@prisma/client'

import { authenticationLogin } from '../authentication'
import prisma from '../prisma'

import { hashPassword } from '@codeanker/authentication'

export async function createMock(runId: string) {
  const accountPassword = 'test'
  const email = `log+${runId}@codeanker.de`
  const account = await prisma.account.create({
    data: {
      email,
      password: await hashPassword(accountPassword),
      activatedAt: new Date(),
      role: Role.ADMIN,
      person: {
        create: {
          firstname: 'Test',
          lastname: 'User',
          email,
          telefon: '+49 123 4567890',
        },
      },
      status: AccountStatus.AKTIV,
    },
  })
  const { accessToken } = await authenticationLogin({
    email: account.email,
    password: accountPassword,
  })

  const veranstaltung = await prisma.veranstaltung.findFirstOrThrow({
    take: 1,
    select: {
      id: true,
    },
  })

  return { account, accountPassword, accessToken, veranstaltung }
}

export async function cleanup(runId: string) {
  await prisma.person.deleteMany({
    where: {
      account: {
        email: `log+${runId}@codeanker.de`,
      },
    },
  })
}
