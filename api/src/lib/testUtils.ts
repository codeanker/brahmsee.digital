import prisma from '../prisma'

export async function createMock() {
  const user = await prisma.user.create({
    data: {
      firstname: 'Test',
      lastname: 'User',
      email: 'log@codeanker.de',
      password: '123',
      role: 'ADMIN',
    },
  })
  return { user }
}

export async function cleanup() {
  await prisma.user.deleteMany({
    where: {
      email: 'log@codeanker.de',
    },
  })
}
