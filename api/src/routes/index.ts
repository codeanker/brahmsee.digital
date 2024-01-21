import Router from 'koa-router'
import { renderTrpcPanel } from 'trpc-panel'

import { appRouter } from '..'
import { sign } from '../authentication'
import config from '../config'
import prisma from '../prisma'
import { isDevelopment } from '../util/is-production'

const koaRouter = new Router()

koaRouter.get('/auth/callback', async (ctx: any) => {
  const profile = ctx.session.grant.response.profile

  // sollte das alles in eine authentication lib?

  // look for existing user
  const existingUser = await prisma.account.findUnique({
    where: {
      email: profile.email as string,
    },
    select: {
      id: true,
    },
  })

  // if user exists, return jwt
  if (existingUser) {
    const jwt = sign({
      sub: existingUser.id.toString(),
    })
    // important to redirect with hash, so the jwt is not sent to the server
    ctx.redirect(`${config.clientUrl}/login#jwt=${jwt}`)
  } else {
    const newUser = await prisma.account.create({
      data: {
        email: profile.email as string,
        password: '',
        role: 'GLIEDERUNG_ADMIN',
        activatedAt: new Date(),
        person: {
          create: {
            firstname: 'Gabi',
            lastname: 'Musterfrau',
            email: profile.email as string,
            telefon: '+49 123 4567890',
          },
        },
      },
      select: {
        id: true,
      },
    })
    const jwt = sign({
      sub: newUser.id.toString(),
    })
    ctx.redirect(`${config.clientUrl}/login#jwt=${jwt}`)
  }
})

if (isDevelopment()) {
  koaRouter.get('/debug', async (ctx) => {
    ctx.headers['content-type'] = 'text/html'
    ctx.body = renderTrpcPanel(appRouter, {
      url: `http://localhost:${config.server.port}/api/trpc`,
      transformer: 'superjson',
    })
  })
}

export default koaRouter
