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

let queryLoggingEnabled = config.loggingLevel === 'debug'

if (config.loggingLevel === 'debug') {
  prisma.$on('query', (e) => {
    if (queryLoggingEnabled) {
      log.debug(e.query)
    }
  })
}

export async function withoutQueryLogging<T>(callback: () => Promise<T>): Promise<T> {
  const previousQueryLoggingEnabled = queryLoggingEnabled
  queryLoggingEnabled = false

  try {
    return await callback()
  } finally {
    queryLoggingEnabled = previousQueryLoggingEnabled
  }
}

export default prisma
