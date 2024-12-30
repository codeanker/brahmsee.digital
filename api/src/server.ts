import cors from '@koa/cors'
import grant from 'grant'
import Koa from 'koa'
import { koaBody } from 'koa-body'
import helmet from 'koa-helmet'
import session from 'koa-session'
import serve from 'koa-static'
import { createKoaMiddleware } from 'trpc-koa-adapter'

import config from './config.js'
import { createContext } from './context.js'
import { logger } from './logger.js'
import cacheControl from './middleware/cache-control.js'
import router from './routes/index.js'

import { appRouter } from './index.js'

export const app = new Koa()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'img-src': ["'self'", '*.githubusercontent.com'],
      },
    },
  })
)
app.use(cors({ origin: '*' }))
app.use(serve('./static', { defer: false }))
app.use(cacheControl)

// koa-session is required by grant
app.keys = ['grant']
app.use(session({}, app))

// grant is used for oauth
app.use(
  grant.koa()({
    defaults: {
      origin: `${config.clientUrl}/api`,
      transport: 'session',
    },
    dlrg: {
      dynamic: ['mode'],
      transport: 'session',
      oauth: 2,
      response: ['token', 'profile'],
      authorize_url: 'https://iam.dlrg.net/auth/realms/master/protocol/openid-connect/auth',
      access_url: 'https://iam.dlrg.net/auth/realms/master/protocol/openid-connect/token',
      key: config.authentication.dlrg.client_id,
      scope: ['profile'],
      profile_url: 'https://iam.dlrg.net/auth/realms/master/protocol/openid-connect/userinfo',
      pkce: true,
    },
  })
)
// initialize trpc middleware
app.use(
  createKoaMiddleware({
    prefix: '/api/trpc',
    router: appRouter,
    createContext,
  })
)

app.use(koaBody({ multipart: true }))
app.use(router.routes())
app.use(router.allowedMethods())

app.use(async (ctx, next) => {
  // serve index.html as catch all
  ctx.url = '/'
  await serve('./static')(ctx, next)
})

app.listen(config.server.port, config.server.host)
logger.info(`app listening on http://${config.server.host}:${config.server.port}`)
