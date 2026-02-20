import { TRPCError } from '@trpc/server'
import z from 'zod'
import prisma from '../../prisma.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import { ZAccountTeilnehmerCreate } from './accountTeilnehmerCreate.js'
import { sendMailConfirmEmailRequest } from './helpers/sendMailConfirmEmailRequest.js'
import { getAccountCreateData } from './schema/account.schema.js'
import { v7 as uuidV7 } from 'uuid'
import { sendMail } from '../../util/mail.js'
import config from '../../config.js'

export const accountGliederungCreateProcedure = definePublicMutateProcedure({
  key: 'gliederungCreate',
  inputSchema: ZAccountTeilnehmerCreate.extend({
    gliederungId: z.string().uuid(),
  }),
  handler: async ({ input }) => {
    const gliederung = await prisma.gliederung.findUnique({
      where: {
        id: input.gliederungId,
      }
    })
    if (gliederung === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Unknown Gliederung',
      })
    }

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

    if (!gliederung.email) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Die Gliederung ${gliederung.name} hat keine Kontaktadresse hinterlegt!`,
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
    })

    const confirmByGliederungToken = uuidV7()

    await prisma.$transaction(async (tx) => {
      const account = await tx.account.create({
        data: accountData,
        select: {
          id: true,
        },
      })
      await tx.gliederungToAccount.create({
        data: {
          createdAt: new Date(),
          gliederungId: input.gliederungId,
          accountId: account.id,
          role: 'DELEGATIONSLEITER',
          confirmedByGliederung: false,
          confirmByGliederungToken,
        },
      })
    })

    if (!accountData.activationToken) throw new Error('No activation token generated')

    await sendMailConfirmEmailRequest(accountData.email, accountData.activationToken)
    await sendMail({
      to: `${gliederung.email}`,
      subject: 'Zugriffsanfrage auf deine Gliederung',
      template: 'gliederung-access-request-info',
      categories: ['access', 'gliederung'],
      variables: {
        hostname: 'brahmsee.digital',
        gliederung: gliederung.name,
        name: gliederung.name,
        veranstaltung: 'Zugriffsanfrage',
        confirmLink: `${config.clientUrl}/confirm/gliederung-access/${confirmByGliederungToken}`,
      },
    })
  },
})
