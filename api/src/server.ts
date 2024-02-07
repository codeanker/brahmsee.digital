import cors from '@koa/cors'
import grant from 'grant'
import Koa from 'koa'
import helmet from 'koa-helmet'
import session from 'koa-session'
import serve from 'koa-static'
import { createKoaMiddleware } from 'trpc-koa-adapter'

import config from './config'
import { createContext } from './context'
import { logger } from './logger'
import cacheControl from './middleware/cache-control'
import router from './routes'
import { isProduction } from './util/is-production'

import { appRouter } from './index'

export const app = new Koa()

app.use(
  helmet({
    contentSecurityPolicy: isProduction(),
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

app.use(router.routes())

app.use(async (ctx, next) => {
  // serve index.html as catch all
  ctx.url = '/'
  await serve('./static')(ctx, next)
})

app.listen(config.server.port, config.server.host)
logger.info(`app listening on http://0.0.0.0:${config.server.port}`)
