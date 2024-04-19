import Router from 'koa-router'
import { renderTrpcPanel } from 'trpc-panel'

import { appRouter } from '..'
import config from '../config'
import addExports from '../exports'
import addMiddlewares from '../middleware'
import { isDevelopment } from '../util/is-production'

import connect from './connect'

const koaRouter = new Router()

koaRouter.get('/connect/dlrg/callback', connect)

if (isDevelopment()) {
  koaRouter.get('/debug', async (ctx) => {
    ctx.headers['content-type'] = 'text/html'
    ctx.body = renderTrpcPanel(appRouter, {
      url: `http://localhost:${config.server.port}/api/trpc`,
      transformer: 'superjson',
    })
  })
}

addExports(koaRouter)
addMiddlewares(koaRouter)

export default koaRouter
