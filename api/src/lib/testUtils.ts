import prisma from '../prisma'

import { hashPassword } from '@codeanker/authentication'

export async function createMock() {
  const userPassword = '123'
  const user = await prisma.user.create({
    data: {
      firstname: 'Test',
      lastname: 'User',
      email: 'log@codeanker.de',
      password: await hashPassword(userPassword),
      role: 'ADMIN',
    },
  })
  return { user, userPassword }
}

export async function cleanup() {
  await prisma.user.deleteMany({
    where: {
      email: 'log@codeanker.de',
    },
  })
}
