import Router from 'koa-router'
import addExports from '../exports/index.js'
import addMiddlewares from '../middleware/index.js'

import connect from './connect.js'

const koaRouter = new Router()

koaRouter.get('/connect/dlrg/callback', connect)

addExports(koaRouter)
addMiddlewares(koaRouter)

export default koaRouter
