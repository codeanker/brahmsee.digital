import { Gender } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import z from 'zod'

import config from '../../config'
import prisma from '../../prisma'
import { ZOauthRegisterJwtPayloadSchema } from '../../routes/connect'
import { defineProcedure } from '../../types/defineProcedure'

import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest'
import { getAccountCreateData } from './schema/account.schema'

const ZAccountGliederungAdminCreateInput = z.strictObject({
  data: z.strictObject({
    firstname: z.string(),
    lastname: z.string(),
    gender: z.nativeEnum(Gender),
    birthday: z.date(),
    email: z.string().email().optional(), // email is required, because oauth login does not have an email
    password: z.string().optional(), // optional, because oauth login does not have a password
    adminInGliederungId: z.number().int(),
    jwtOAuthToken: z.string().optional(), // optional, becaus normal registration does not have a jwtOAuthToken
  }),
})

export const accountGliederungAdminCreateProcedure = defineProcedure({
  key: 'gliederungAdminCreate',
  method: 'mutation',
  protection: { type: 'public' },
  inputSchema: ZAccountGliederungAdminCreateInput,
  async handler(options) {
    const gliederung = await prisma.gliederung.findUniqueOrThrow({
      where: {
        id: options.input.data.adminInGliederungId,
      },
      select: {
        id: true,
        GliederungToAccount: {
          select: {
            accountId: true,
            role: true,
          },
        },
      },
    })

    let dlrgOauthId: undefined | string = undefined
    // check if jwtOAuthToken set and if so, check if it is valid
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (options.input.data.jwtOAuthToken) {
      const jwtOAuthTokenPayload = ZOauthRegisterJwtPayloadSchema.parse(
        jwt.verify(options.input.data.jwtOAuthToken, `${config.authentication.secret}-oauth`)
      )
      options.input.data.email = jwtOAuthTokenPayload.email
      dlrgOauthId = jwtOAuthTokenPayload.sub
    }

    if (gliederung.GliederungToAccount.filter((relation) => relation.role === 'DELEGATIONSLEITER').length > 0) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'Gliederung hat bereits einen Admin',
      })
    }
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!options.input.data.email) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email muss angegeben werden',
      })
    }
    const accountData = await getAccountCreateData({
      email: options.input.data.email,
      firstname: options.input.data.firstname,
      lastname: options.input.data.lastname,
      password: options.input.data.password,
      birthday: options.input.data.birthday,
      gender: options.input.data.gender,
      roleId: 'GLIEDERUNG_ADMIN',
      isActiv: false,
      adminInGliederungId: options.input.data.adminInGliederungId,
    })
    const res = await prisma.account.create({
      data: {
        ...accountData,
        dlrgOauthId,
      },
      select: {
        id: true,
      },
    })

    await sendMailConfirmEmailRequest({
      email: accountData.email,
      activationToken: accountData.activationToken,
    })

    return res
  },
})
