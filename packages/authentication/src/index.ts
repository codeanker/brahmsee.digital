import { TRPCError } from '@trpc/server'
import brypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { StringValue } from 'ms'
import z from 'zod'

export { type StringValue }

// type AuthenticateJwtOptions = {
//   ctx: {
//     user: NonNullable<Context['user']>
//   }
// }

// strict object prevents with parse unwanted additional properties
const ZAuthenticateJwtPayloadSchema = z.strictObject({
  sub: z.string(),
})

type TAuthenticateJwtPayloadSchema = z.infer<typeof ZAuthenticateJwtPayloadSchema>

// schema for the JWT token with payload and expiration / issued at
const ZAuthenticateJwtSchema = ZAuthenticateJwtPayloadSchema.extend({
  iat: z.number(),
  exp: z.number(),
})
type TAuthenticateJwtSchema = z.infer<typeof ZAuthenticateJwtSchema>

function verify(token: string, jwtSecret: string): TAuthenticateJwtSchema {
  const jwtAuth = jwt.verify(token, jwtSecret) as TAuthenticateJwtSchema
  ZAuthenticateJwtSchema.parse(jwtAuth)
  return jwtAuth
}

function sign(payload: TAuthenticateJwtPayloadSchema, jwtSecret: string, expiresIn: StringValue) {
  ZAuthenticateJwtPayloadSchema.parse(payload)
  return jwt.sign(payload, jwtSecret, {
    expiresIn,
  })
}

export function hashPassword(password: string) {
  return brypt.hash(password, 10)
}

export async function passwordMatches(hash: string | null, password: string) {
  if (!hash) return false
  return await brypt.compare(password, hash)
}

export function createAuthentication<EnitiyId>({
  jwtSecret,
  expiresIn,
  getEnityByEmail,
}: {
  jwtSecret: string
  expiresIn: StringValue
  getEnityByEmail: (email: string) => Promise<{
    id: EnitiyId
    password: string
  }>
}) {
  async function authenticationLogin(args: { email: string; password: string }) {
    const { email, password } = args
    const { password: hashedPassword, ...userWithoutPassword } = await getEnityByEmail(email)

    if (!(await passwordMatches(hashedPassword, password))) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Email or password is incorrect',
      })
    }
    const accessToken = sign(
      {
        sub: (userWithoutPassword.id as string).toString(),
      },
      jwtSecret,
      expiresIn
    )

    return {
      accessToken,
      user: userWithoutPassword,
    }
  }

  function getEntityIdFromHeader(authorizationHeader: string | undefined) {
    if (authorizationHeader?.startsWith('Bearer ')) {
      const token = authorizationHeader.substring(7, authorizationHeader.length)
      const { sub: id } = verify(token, jwtSecret)
      return id
    }
  }

  return {
    authenticationLogin,
    getEntityIdFromHeader,
    sign(this: void, payload: TAuthenticateJwtPayloadSchema) {
      return sign(payload, jwtSecret, expiresIn)
    },
  }
}
