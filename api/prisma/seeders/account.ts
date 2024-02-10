/* eslint-disable no-console */
import { PrismaClient, AccountStatus } from '@prisma/client'

import logActivity from '../../src/util/activity'
import { isProduction } from '../../src/util/is-production'

import { Seeder } from '.'

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
      role: 'ADMIN',
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

  console.log('Created default user account.')
  console.log('\tEmail: %s', email)
  console.log('\tPassword: %s', password)
}

export default createAccount
