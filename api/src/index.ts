import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import config from 'config'
import Koa from 'koa'
import { createKoaMiddleware } from 'trpc-koa-adapter'

import { koaRouter } from './middlewares'
import { appRouter } from './services'

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter
export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

const app = new Koa()
const adapter = createKoaMiddleware({
  router: appRouter,
  prefix: '/trpc',
})
app.use(adapter)
app.use(koaRouter.routes())

const port = config.get('port')
// eslint-disable-next-line no-console
console.log('Server started on port ' + port)
app.listen(port)
