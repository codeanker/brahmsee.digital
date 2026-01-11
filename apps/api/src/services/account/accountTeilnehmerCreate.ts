import { Gender } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import z from 'zod'
import prisma from '../../prisma.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest.js'
import { getAccountCreateData } from './schema/account.schema.js'

export const accountTeilnehmerCreateProcedure = definePublicMutateProcedure({
  key: 'teilnehmerCreate',
  inputSchema: z.strictObject({
    firstname: z.string(),
    lastname: z.string(),
    gender: z.nativeEnum(Gender),
    birthday: z.date(),
    email: z.string().email(),
    password: z.string(),
  }),
  handler: async ({ input }) => {
    const existing = await prisma.account.findFirst({
      where: {
        email: input.email,
      },
      select: {
        id: true,
      },
    })
    if (existing !== null) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Email is already registered',
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
