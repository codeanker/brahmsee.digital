import { Gender } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import jwt from 'jsonwebtoken'
import z from 'zod'

import config from '../../config.js'
import prisma from '../../prisma.js'
import { ZOauthRegisterJwtPayloadSchema } from '../../routes/connect.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'

import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest.js'
import { getAccountCreateData } from './schema/account.schema.js'

const ZAccountGliederungAdminCreateInput = z.strictObject({
  data: z.strictObject({
    firstname: z.string(),
    lastname: z.string(),
    gender: z.nativeEnum(Gender),
    birthday: z.date(),
    email: z.string().email().optional(), // email is required, because oauth login does not have an email
    password: z.string().optional(), // optional, because oauth login does not have a password
    gliederungId: z.number().int(),
    jwtOAuthToken: z.string().optional(), // optional, becaus normal registration does not have a jwtOAuthToken
  }),
})

export const accountGliederungAdminCreateProcedure = definePublicMutateProcedure({
  key: 'gliederungAdminCreate',
  inputSchema: ZAccountGliederungAdminCreateInput,
  async handler({ ctx, input }) {
    let dlrgOauthId: undefined | string = undefined
    // check if jwtOAuthToken set and if so, check if it is valid

    if (input.data.jwtOAuthToken) {
      const jwtOAuthTokenPayload = ZOauthRegisterJwtPayloadSchema.parse(
        jwt.verify(input.data.jwtOAuthToken, `${config.authentication.secret}-oauth`)
      )
      input.data.email = jwtOAuthTokenPayload.email
      dlrgOauthId = jwtOAuthTokenPayload.sub
    }

    if (!input.data.email) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email muss angegeben werden',
      })
    }
    const accountData = await getAccountCreateData({
      email: input.data.email,
      firstname: input.data.firstname,
      lastname: input.data.lastname,
      password: input.data.password,
      birthday: input.data.birthday,
      gender: input.data.gender,
      roleId: 'GLIEDERUNG_ADMIN',
      isActiv: false,
      gliederungId: input.data.gliederungId,
      adminInGliederungId: input.data.gliederungId,
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

    if (!accountData.activationToken) throw new Error('No activation token generated')
    await sendMailConfirmEmailRequest(ctx, {
      activationToken: accountData.activationToken,
      email: accountData.email,
    })

    return res
  },
})
