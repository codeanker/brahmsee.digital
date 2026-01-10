import { TRPCError } from '@trpc/server'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest.js'
import { getAccountCreateData } from './schema/account.schema.js'
import { z } from 'zod'
import { Gender } from '@prisma/client'

export const accountGliederungAdminCreateProcedure = defineProtectedMutateProcedure({
  key: 'gliederungAdminCreate',
  inputSchema: z.strictObject({
    firstname: z.string(),
    lastname: z.string(),
    gender: z.nativeEnum(Gender),
    birthday: z.date(),
    email: z.string().email().optional(), // email is required, because oauth login does not have an email
    password: z.string().optional(), // optional, because oauth login does not have a password
    gliederungId: z.number().int(),
  }),
  roleIds: ['ADMIN'],
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
      roleId: 'GLIEDERUNG_ADMIN',
      isActiv: false,
      gliederungId: input.gliederungId,
      adminInGliederungId: input.gliederungId,
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
