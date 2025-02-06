/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
// import config from 'config'
import { PrismaClient } from '@prisma/client'

import config from './config.js'
import { logger } from './logger.js'

const log = logger.child({ label: 'db' })

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
  datasources: {
    db: {
      url: config.db.url,
    },
  },
})

if (config.loggingLevel === 'debug') {
  prisma.$on('query', (e) => {
    log.debug(e.query)
  })
}

export default prisma
