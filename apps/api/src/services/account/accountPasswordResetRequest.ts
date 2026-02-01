import * as uuid from 'uuid'
import z from 'zod'

import config from '../../config.js'
import prisma from '../../prisma.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import { sendMail } from '../../util/mail.js'

export const accountPasswordResetRequestProcedure = definePublicMutateProcedure({
  key: 'requestPasswordReset',
  inputSchema: z.strictObject({
    email: z.string(),
  }),
  async handler({ input }) {
    const account = await prisma.account.findUnique({
      where: {
        email: input.email,
      },
      select: {
        email: true,
        dlrgOauthId: true,
        passwordResetToken: true,
        person: {
          select: {
            firstname: true,
            lastname: true,
          },
        },
      },
    })
    if (account === null) {
      return
    }

    // send informational mail
    if (account.dlrgOauthId !== null) {
      await sendMail({
        to: account.email,
        subject: 'Passwort zurücksetzen',
        categories: ['account', 'passwordReset'],
        template: 'account-password-reset-oauth',
        variables: {
          gliederung: 'DLRG',
          name: `${account.person.firstname} ${account.person.lastname}`,
          hostname: 'brahmsee.digital',
          veranstaltung: 'brahmsee.digital',
        },
      })
      return
    }

    let resetToken: string | null = null

    if (account.passwordResetToken != null) {
      resetToken = account.passwordResetToken
    } else {
      const res = await prisma.account.update({
        where: {
          email: input.email,
        },
        data: {
          passwordResetToken: uuid.v4(),
        },
      })
      resetToken = res.passwordResetToken
    }

    if (resetToken !== null) {
      const resetUrl = `${config.clientUrl}/password-reset/${resetToken}`
      await sendMail({
        to: account.email,
        subject: 'Passwort zurücksetzen',
        categories: ['account', 'passwordReset'],
        template: 'account-password-reset',
        variables: {
          gliederung: 'DLRG',
          name: `${account.person.firstname} ${account.person.lastname}`,
          hostname: 'brahmsee.digital',
          veranstaltung: 'brahmsee.digital',
          resetUrl,
        },
      })
    }
  },
})
