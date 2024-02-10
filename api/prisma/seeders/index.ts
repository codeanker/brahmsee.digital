/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'

import { isProduction } from '../../src/util/is-production'

import createAccount from './account'
import createAnmeldung from './anmeldungen'
import importGliederungen from './gliederungen'
import createVeranstaltung from './veranstaltung'

export type Seeder = (prisma: PrismaClient) => Promise<void>

const seeders: Seeder[] = (() => {
  // in produktion nur Gliederungen importieren
  if (isProduction()) {
    return [importGliederungen]
  }

  return [importGliederungen, createAccount, createVeranstaltung, createAnmeldung]
})()

const prisma = new PrismaClient()

await prisma.$connect()

try {
  for (const seeder of seeders) {
    await seeder(prisma)
  }
} catch (e) {
  console.error(e)
  process.exit(1)
}

await prisma.$disconnect()
