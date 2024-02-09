import type { Middleware } from 'koa'

const cacheExclude = [/^\/api.*/gi, /^\/index.html/gi, /^\//gi]

const cacheControl: Middleware = async (ctx, next) => {
  let setCache = true
  for (const exclusion of cacheExclude) {
    if (exclusion.test(ctx.path)) {
      setCache = false
      break
    }
  }

  if (setCache) {
    ctx.set('cache-control', 'max-age: 31536000, immutable') // 1 week
  }

  return await next()
}

export default cacheControl
