/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
// import config from 'config'
import { PrismaClient } from '@prisma/client'

import config from './config'

export default new PrismaClient({
  datasources: {
    db: {
      url: config.db.url,
    },
  },
})
