import cors from '@koa/cors'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import Koa from 'koa'
import serve from 'koa-static'
import { createKoaMiddleware } from 'trpc-koa-adapter'

import config from './config'
import { createContext } from './context'
import { logger } from './logger'
import router from './routes'

import { appRouter } from './index'

export const app = new Koa()

app.use(cors({ origin: '*' }))
app.use(serve('./static'))

// initialize trpc middleware
const adapter = createKoaMiddleware({
  router: appRouter,
  createContext,
  prefix: '/trpc',
})
app.use(adapter)

// initialize koa router for custome routes
app.use(router.routes())

app.listen(config.port)
logger.info(`app listening on http://0.0.0.0:${config.port}`)

export type AppRouter = typeof appRouter
export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>
