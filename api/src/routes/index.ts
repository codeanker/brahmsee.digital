import Router from 'koa-router'
import { renderTrpcPanel } from 'trpc-panel'

import { appRouter } from '..'
import config from '../config'

const koaRouter = new Router()

if (process.env.NODE_ENV !== 'production') {
  koaRouter.get('/debug', async (ctx) => {
    ctx.headers['content-type'] = 'text/html'
    ctx.body = renderTrpcPanel(appRouter, {
      url: `http://localhost:${config.server.port}/api/trpc`,
      transformer: 'superjson',
    })
  })
}

export default koaRouter
