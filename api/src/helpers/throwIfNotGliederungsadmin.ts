import prisma from '../prisma'

export async function throwIfNotGliederungsadmin(context: { accountId: number; gliederungId: number }) {
  await prisma.gliederung.findFirstOrThrow({
    where: {
      id: context.gliederungId,
      admins: {
        some: {
          id: context.accountId,
        },
      },
    },
    select: {
      id: true,
    },
  })
}
