import { authenticationLogin } from '../authentication'
import prisma from '../prisma'

import { hashPassword } from '@codeanker/authentication'

export async function createMock(runId: string) {
  const accountPassword = 'test'
  const account = await prisma.account.create({
    data: {
      email: `log+${runId}@codeanker.de`,
      password: await hashPassword(accountPassword),
      role: 'ADMIN',
      person: {
        create: {
          firstname: 'Test',
          lastname: 'User',
        },
      },
    },
  })
  const { accessToken } = await authenticationLogin({
    email: account.email,
    password: accountPassword,
  })

  return { account, accountPassword, accessToken }
}

export async function cleanup(runId: string) {
  await prisma.account.deleteMany({
    where: {
      email: `log+${runId}@codeanker.de`,
    },
  })
}
