/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'

import createAccount from './account'
import createAnmeldung from './anmeldungen'
import importGliederungen from './gliederungen'
import createVeranstaltung from './veranstaltung'

export type Seeder = (prisma: PrismaClient) => Promise<void>

const seeders: Seeder[] = [importGliederungen, createAccount, createVeranstaltung, createAnmeldung]

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
