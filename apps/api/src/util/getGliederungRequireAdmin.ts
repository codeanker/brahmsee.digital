import { GliederungAccountRole } from '@prisma/client'

import prisma from '../prisma.js'
/**
 * get gliederung where `accountId` is admin
 *
 * @param accountId the account ID to get the gliederung for
 * @returns the gliederung or
 * @throws exception if the user identified by `accountId` is not an admin
 */
export async function getGliederungRequireAdmin(accountId: string) {
  return prisma.gliederung.findFirstOrThrow({
    where: {
      GliederungToAccount: {
        some: {
          accountId,
          role: GliederungAccountRole.DELEGATIONSLEITER,
          confirmedByGliederung: true,
          confirmByGliederungToken: null,
        },
      },
    },
  })
}
