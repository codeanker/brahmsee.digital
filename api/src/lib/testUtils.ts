import prisma from '../prisma'

export async function createMock() {
  const account = await prisma.account.create({
    data: {
      email: 'log@codeanker.de',
      password: '123',
      role: 'ADMIN',
      person: {
        create: {
          firstname: 'Test',
          lastname: 'User',
        },
      },
    },
  })
  return { account }
}

export async function cleanup() {
  await prisma.account.deleteMany({
    where: {
      email: 'log@codeanker.de',
    },
  })
}
