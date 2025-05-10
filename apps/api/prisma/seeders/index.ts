import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

import { logger } from '../../src/logger.js'
import { isProduction } from '../../src/util/is-production.js'

import createAccount from './account.js'
import createAnmeldung from './anmeldungen.js'
import importGliederungen from './gliederungen.js'
import createVeranstaltung from './veranstaltung.js'
import createProgramm from './programm.js'

export type Seeder = (prisma: PrismaClient) => Promise<void>

const seeders: Seeder[] = (() => {
  // in produktion nur Gliederungen importieren
  if (isProduction() || process.env.DISABLE_SEEDER === '1') {
    return [importGliederungen]
  }

  return [importGliederungen, createAccount, createVeranstaltung, createAnmeldung, createProgramm]
})()

const prisma = new PrismaClient()

await prisma.$connect()

try {
  for (const seeder of seeders) {
    const start = dayjs()
    await seeder(prisma)
    const end = dayjs()
    logger.info(`seeder "${seeder.name}" took ${end.diff(start, 'seconds', true)}s`)
  }
} catch (e) {
  console.error(e)
  process.exit(1)
}

await prisma.$disconnect()
