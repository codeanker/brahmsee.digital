import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { trpcServer } from '@hono/trpc-server'
import { cache } from 'hono/cache'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { requestId } from 'hono/request-id'
import { secureHeaders } from 'hono/secure-headers'
import { resolve } from 'node:path'
import config from './config.js'
import { createContext } from './context.js'
import { appRouter } from './index.js'
import { logger as appLogger } from './logger.js'
import * as routes from './routes/index.js'
import { makeApp } from './util/make-app.js'

const app = makeApp()
  .use(async (c, next) => {
    // generic error handler
    await next()
    if (c.error) {
      console.error(c.error)
    }
  })
  .use(logger(appLogger.debug))
  .use(requestId())
  .use(
    secureHeaders({
      contentSecurityPolicy: {
        connectSrc: ["'self'", 'dlrgbrahmseedigitalprod.blob.core.windows.net'],
        imgSrc: [
          "'self'",
          '*.githubusercontent.com',
          'blob:',
          'data:',
          'dlrgbrahmseedigitalprod.blob.core.windows.net',
        ],
      },
    })
  )
  .use(cors({ origin: '*' }))
  .use(
    cache({
      cacheName: 'brahmsee.digital',
      cacheControl: 'max-age: 31536000, immutable',
      wait: true,
    })
  )
  .use(
    '/api/trpc/*',
    trpcServer({
      router: appRouter,
      endpoint: '/api/trpc',
      createContext,
    })
  )
  .use(
    serveStatic({
      root: resolve('./static'),
      rewriteRequestPath: (p) => p.replace(/^\/static/, '/'),
    })
  )
  .route('/oidc', routes.oidcRouter)

const server = serve({
  fetch: app.fetch,
  hostname: config.server.host,
  port: config.server.port,
})

appLogger.info(`app listening on http://${config.server.host}:${config.server.port}`)

// graceful shutdown
process.on('SIGINT', () => {
  server.close()
  process.exit(0)
})
process.on('SIGTERM', () => {
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})
