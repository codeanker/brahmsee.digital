import Router from 'koa-router'

const koaRouter = new Router()

koaRouter.get('/hello', async (ctx, next) => {
  ctx.body = { msg: 'hello world' }
  await next()
})

export default koaRouter
