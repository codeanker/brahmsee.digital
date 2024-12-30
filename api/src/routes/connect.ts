import jwt from 'jsonwebtoken'
import type { Context } from 'koa'
import { z } from 'zod'

import { sign } from "../authentication.js"
import config from "../config.js"
import prisma from "../prisma.js"

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

const ZOauthMode = z.enum(['login', 'register'])

export const ZOauthRegisterJwtPayloadSchema = z.object({
  sub: z.string(),
  email: z.string(),
  firstname: z.string(),
  lastname: z.string(),
})

type TOauthRegisterJwtPayloadSchema = z.infer<typeof ZOauthRegisterJwtPayloadSchema>

export default async function (ctx: Context) {
  const userInfoResponse = ZUserInfoReponse.parse(ctx.session.grant.response)
  const profile = userInfoResponse.profile

  const mode = ZOauthMode.parse(ctx.session.grant.dynamic.mode)

  if (mode === 'register') {
    const payload: TOauthRegisterJwtPayloadSchema = {
      sub: profile.sub,
      email: profile.email,
      firstname: profile.given_name,
      lastname: profile.family_name,
    }
    const expiresIn = '1h'
    // create a jwt with the sub and redirect to register page
    const jwtOAuthToken = jwt.sign(payload, `${config.authentication.secret}-oauth`, {
      expiresIn,
    })
    ctx.redirect(`${config.clientUrl}/registrierung/gliederung/callback#jwtOAuthToken=${jwtOAuthToken}`)
  }

  // if no mode selelected or mode is login, try to login
  if (mode === 'login') {
    await oauthLogin(ctx, profile)
  }
}

async function oauthLogin(ctx: Context, profile: (typeof ZUserInfoReponse._type)['profile']) {
  // look for existing user
  const existingUser = await prisma.account.findUnique({
    where: {
      dlrgOauthId: profile.sub,
    },
    select: {
      id: true,
      status: true,
    },
  })

  // if user exists, return jwt
  if (existingUser) {
    if (existingUser.status !== 'AKTIV') {
      ctx.redirect(
        `${config.clientUrl}/login#error=Account ist nicht aktiviert. Bitte wende dich an den Administrator.`
      )
    } else {
      const jwt = sign({
        sub: existingUser.id.toString(),
      })
      // important to redirect with hash, so the jwt is not sent to the server
      ctx.redirect(`${config.clientUrl}/login#jwt=${jwt}`)
    }
  } else {
    ctx.redirect(`${config.clientUrl}/registrierung`)
  }
}
