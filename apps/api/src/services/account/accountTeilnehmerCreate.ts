import { Gender } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest.js'
import { getAccountCreateData } from './schema/account.schema.js'
// import { ZOauthRegisterJwtPayloadSchema } from '../../routes/oidc/connect.js'

export const accountTeilnehmerCreateProcedure = defineProtectedMutateProcedure({
  key: 'teilnehmerCreate',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    firstname: z.string(),
    lastname: z.string(),
    gender: z.nativeEnum(Gender),
    birthday: z.date(),
    email: z.string().email().optional(), // email is required, because oauth login does not have an email
    password: z.string().optional(), // optional, because oauth login does not have a password
    gliederungId: z.number().int(),
  }),
  handler: async ({ input }) => {
    if (!input.email) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email muss angegeben werden',
      })
    }
    const accountData = await getAccountCreateData({
      email: input.email,
      firstname: input.firstname,
      lastname: input.lastname,
      password: input.password,
      birthday: input.birthday,
      gender: input.gender,
      roleId: 'USER',
      isActiv: false,
      gliederungId: input.gliederungId,
    })

    const res = await prisma.account.create({
      data: accountData,
      select: {
        id: true,
      },
    })

    if (!accountData.activationToken) throw new Error('No activation token generated')
    await sendMailConfirmEmailRequest(accountData.email, accountData.activationToken)

    return res
  },
})
