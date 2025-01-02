import { PrismaClient, AccountStatus, Role } from '@prisma/client'

import { logger } from '../../src/logger.js'
import logActivity from '../../src/util/activity.js'
import { isProduction } from '../../src/util/is-production.js'

import type { Seeder } from './index.js'

import { hashPassword } from '@codeanker/authentication'

const createAccount: Seeder = async (prisma: PrismaClient) => {
  // create default user in development
  if (isProduction()) {
    return
  }

  const email = 'admin@example.org'
  const password = 'admin'

  const res = await prisma.account.create({
    data: {
      email,
      password: await hashPassword(password),
      role: Role.ADMIN,
      status: AccountStatus.AKTIV,
      activatedAt: new Date(),
      person: {
        create: {
          firstname: 'Gabi',
          lastname: 'Musterfrau',
          telefon: '+49 123 4567890',
          email,
        },
      },
    },
    select: {
      id: true,
    },
  })

  await logActivity({
    type: 'CREATE',
    description: `account was created via db seeder`,
    subjectType: 'account',
    subjectId: res.id,
  })

  logger.info('Created default user account.', {
    email,
    password,
  })
}

export default createAccount
