/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client'
import dayjs from 'dayjs'

import { logger } from '../../src/logger'
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
