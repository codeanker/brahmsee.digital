import Router from 'koa-router'
import { renderTrpcPanel } from 'trpc-panel'

import { appRouter } from "...js"
import config from "../config.js"
import addExports from "../exports.js"
import addMiddlewares from "../middleware.js"
import { isDevelopment } from "../util/is-production.js"

import connect from "./connect.js"

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
