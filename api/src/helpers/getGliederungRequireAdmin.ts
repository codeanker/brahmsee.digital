import prisma from '../prisma'

/**
 * get gliederung where `accountId` is admin
 *
 * @param accountId the account ID to get the gliederung for
 * @returns the gliederung or
 * @throws exception if the user identified by `accountId` is not an admin
 */
export async function getGliederungRequireAdmin(accountId: number) {
  return prisma.gliederung.findFirstOrThrow({
    where: {
      admins: {
        some: {
          id: accountId,
        },
      },
    },
  })
}
