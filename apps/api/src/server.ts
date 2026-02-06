import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { trpcServer } from '@hono/trpc-server'
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

const staticRoot = resolve('./static')

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
    '/api/trpc/*',
    trpcServer({
      router: appRouter,
      endpoint: '/api/trpc',
      createContext,
    })
  )
  .route('/api/export', routes.exportRouter)
  .route('/api/import', routes.importRouter)
  .route('/api/file', routes.fileRouter)
  .route('/api/connect', routes.oidcRouter)
  .use(
    serveStatic({
      root: staticRoot,
      rewriteRequestPath: (p) => p.replace(/^\/static/, '/'),
    })
  )
  // fallback to index.html for client-side routing
  .use(
    serveStatic({
      root: staticRoot,
      rewriteRequestPath: () => '/index.html',
    })
  )

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
