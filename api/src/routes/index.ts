import Router from 'koa-router'
import { renderTrpcPanel } from 'trpc-panel'

import { appRouter } from '..'
import config from '../config'

const koaRouter = new Router()

koaRouter.get('/debug', async (ctx) => {
  ctx.headers['content-type'] = 'text/html'
  ctx.body = renderTrpcPanel(appRouter, {
    url: `http://localhost:${config.port}/api/trpc`,
    transformer: 'superjson',
  })
})

export default koaRouter
