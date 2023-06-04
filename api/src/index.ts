import { appRouter } from './services'
import * as Koa from 'koa'
import { createKoaMiddleware } from 'trpc-koa-adapter'
import { koaRouter } from './middlewares'
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server'

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

// eslint-disable-next-line no-console
console.log('Server started on port 3030')
app.listen(3030)
