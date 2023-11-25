import cors from '@koa/cors'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import Koa from 'koa'
import helmet from 'koa-helmet'
import serve from 'koa-static'
import { createKoaMiddleware } from 'trpc-koa-adapter'

import config from './config'
import { createContext } from './context'
import { logger } from './logger'
import cacheControl from './middleware/cache-control'
import router from './routes'
import { isProduction } from './util/is-production'

import { appRouter } from './index'

export const app = new Koa()

app.use(
  helmet({
    contentSecurityPolicy: isProduction(),
  })
)
app.use(cors({ origin: '*' }))
app.use(serve('./static', { defer: false }))
app.use(cacheControl)

// initialize trpc middleware
app.use(
  createKoaMiddleware({
    prefix: '/api/trpc',
    router: appRouter,
    createContext,
  })
)

app.use(router.routes())

app.use(async (ctx, next) => {
  // serve index.html as catch all
  ctx.url = '/'
  await serve('./static')(ctx, next)
})

app.listen(config.server.port, config.server.host)
logger.info(`app listening on http://0.0.0.0:${config.server.port}`)

export type AppRouter = typeof appRouter
export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
