import type { Context } from 'koa'
import { z } from 'zod'

import { sign } from '../authentication'
import config from '../config'
import prisma from '../prisma'

const ZUserInfoReponse = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  profile: z.object({
    sub: z.string(),
    email_verified: z.boolean(),
    name: z.string(),
    preferred_username: z.string(),
    given_name: z.string(),
    family_name: z.string(),
    email: z.string().email(),
  }),
})

export default async function (ctx: Context) {
  const userInfoResponse = ZUserInfoReponse.parse(ctx.session.grant.response)
  const profile = userInfoResponse.profile

  // look for existing user
  const existingUser = await prisma.account.findUnique({
    where: {
      dlrgOauthId: profile.sub,
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
    throw new Error('no account found')

    // const newUser = await prisma.account.create({
    //   data: {
    //     email: profile.email as string,
    //     password: '',
    //     role: 'GLIEDERUNG_ADMIN',
    //     activatedAt: new Date(),
    //     person: {
    //       create: {
    //         firstname: 'Gabi',
    //         lastname: 'Musterfrau',
    //       },
    //     },
    //   },
    //   select: {
    //     id: true,
    //   },
    // })
    // const jwt = sign({
    //   sub: newUser.id.toString(),
    // })
    // ctx.redirect(`${config.clientUrl}/login#jwt=${jwt}`)
  }
}
