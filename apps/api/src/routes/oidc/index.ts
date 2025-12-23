import type { TypedResponse } from 'hono'
import { deleteCookie, getCookie, setCookie } from 'hono/cookie'
import { HTTPException } from 'hono/http-exception'
import * as oauth from 'oauth4webapi'
import { z } from 'zod'
import { makeApp } from '../../util/make-app.js'
import prisma from '../../prisma.js'
import { sign } from '../../authentication.js'
import config from '../../config.js'

export const oidcRouter = makeApp()

const algorithm: oauth.DiscoveryRequestOptions['algorithm'] = 'oidc'
const ZProfile = z.object({
  sub: z.string(),
  preferred_username: z.string(),
  email: z.string().email(),
  given_name: z.string(),
  family_name: z.string(),
})

oidcRouter.get('/dlrg/callback', async (c) => {
  const issuer = new URL(config.authentication.dlrg.issuer)
  const discoveryRequestResponse = await oauth.discoveryRequest(issuer, {
    algorithm,
    [oauth.allowInsecureRequests]: config.authentication.dlrg.allowInsecure,
  })
  const as = await oauth.processDiscoveryResponse(issuer, discoveryRequestResponse)
  const client: oauth.Client = { client_id: config.authentication.dlrg.clientId }
  const clientAuth = oauth.ClientSecretPost(config.authentication.dlrg.clientSecret)
  const redirect_uri = `${config.clientUrl}/api/oidc/dlrg/callback`
  const currentUrl: URL = new URL(c.req.url, config.clientUrl)
  const params = oauth.validateAuthResponse(as, client, currentUrl)

  const code_verifier = getCookie(c, 'code_verifier')
  if (!code_verifier) {
    deleteCookie(c, 'code_verifier')
    throw new HTTPException(400)
  }
  const nonce = getCookie(c, 'nonce')
  if (!nonce) {
    deleteCookie(c, 'nonce')
    throw new HTTPException(400)
  }

  const response = await oauth.authorizationCodeGrantRequest(
    as,
    client,
    clientAuth,
    params,
    redirect_uri,
    code_verifier,
    {
      [oauth.allowInsecureRequests]: config.authentication.dlrg.allowInsecure,
    }
  )

  const result = await oauth.processAuthorizationCodeResponse(as, client, response, {
    expectedNonce: nonce,
    requireIdToken: true,
  })
  // const claims = oauth.getValidatedIdTokenClaims(result)
  const userInfoResponse = await fetch(as.userinfo_endpoint!, {
    headers: {
      Authorization: `Bearer ${result.access_token}`,
    },
  })
  const profileRaw = await userInfoResponse.json()
  const profile = ZProfile.parse(profileRaw)
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

    await prisma.account.update({
      where: {
        id: existingUser.id,
      },
      data: {
        person: {
          update: {
            firstname: profile.given_name,
            lastname: profile.family_name,
          },
        },
      },
    })

    // important to redirect with hash, so the jwt is not sent to the server
    return c.redirect(`${config.clientUrl}/login#jwt=${jwt}`)
  } else {
    const newUser = await prisma.account.create({
      data: {
        dlrgOauthId: profile.sub,
        email: profile.email,
        password: '',
        role: 'USER',
        status: 'AKTIV',
        person: {
          create: {
            firstname: profile.given_name,
            lastname: profile.family_name,
            email: profile.email,
            telefon: '',
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
    return c.redirect(`${config.clientUrl}/login#jwt=${jwt}`)
  }
})

oidcRouter.get('/dlrg/login', async (c): Promise<Response & TypedResponse<undefined, 302, 'redirect'>> => {
  const issuer = new URL(config.authentication.dlrg.issuer)
  const code_challenge_method = 'S256'
  const code_verifier = oauth.generateRandomCodeVerifier()
  const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier)

  const discoveryRequestResponse = await oauth.discoveryRequest(issuer, {
    algorithm,
    [oauth.allowInsecureRequests]: config.authentication.dlrg.allowInsecure,
  })
  const as = await oauth.processDiscoveryResponse(issuer, discoveryRequestResponse)
  const authorizationUrl = new URL(as.authorization_endpoint!)
  authorizationUrl.searchParams.set('client_id', config.authentication.dlrg.clientId)
  authorizationUrl.searchParams.set('redirect_uri', `${config.clientUrl}/api/oidc/dlrg/callback`)
  authorizationUrl.searchParams.set('response_type', 'code')
  authorizationUrl.searchParams.set('scope', 'openid profile email')
  authorizationUrl.searchParams.set('code_challenge', code_challenge)
  authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method)

  setCookie(c, 'code_verifier', code_verifier, {
    httpOnly: true,
    secure: false,
  })

  const nonce = oauth.generateRandomNonce()
  authorizationUrl.searchParams.set('nonce', nonce)
  setCookie(c, 'nonce', nonce, {
    httpOnly: true,
    secure: false,
  })

  return c.redirect(authorizationUrl)
})
