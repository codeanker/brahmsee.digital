import * as Router from 'koa-router'

const koaRouter = new Router()

koaRouter.get('/', async (ctx, next) => {
  ctx.body = { msg: 'hello world' }
  await next()
})

export { koaRouter }
