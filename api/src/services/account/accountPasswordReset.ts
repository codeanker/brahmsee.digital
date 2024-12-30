import { v4 as uuidv4 } from 'uuid'
import z from 'zod'

import config from "../../config.js"
import prisma from "../../prisma.js"
import { defineProcedure } from "../../types/defineProcedure.js"
import { sendMail } from "../../util/mail.js"

import { hashPassword } from '@codeanker/authentication'

export const accountPasswordResetProcedure = defineProcedure({
  key: 'resetPassword',
  method: 'mutation',
  protection: { type: 'public' },
  inputSchema: z.strictObject({
    email: z.string().optional(),
    passwordResetToken: z.string().optional(),
    password: z.string().optional(),
  }),
  async handler(options) {
    // Create Reset Token and send per Mail
    if (options.input.email != null && options.input.passwordResetToken == null && options.input.password == null) {
      const findRes = await prisma.account.findUnique({
        where: {
          email: options.input.email,
        },
        select: {
          email: true,
          passwordResetToken: true,
          person: {
            select: {
              firstname: true,
              lastname: true,
              gliederung: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      })
      if (findRes === null) {
        return {
          status: true,
        }
      }

      let resetToken: string | null = null
      const email = findRes.email

      if (findRes.passwordResetToken != null) {
        resetToken = findRes.passwordResetToken
      } else {
        const res = await prisma.account.update({
          where: {
            email: options.input.email,
          },
          data: {
            passwordResetToken: uuidv4(),
          },
        })
        resetToken = res.passwordResetToken
      }

      if (resetToken !== null) {
        const resetUrl = `${config.clientUrl}/password-reset/${resetToken}`
        await sendMail({
          to: email,
          subject: 'Passwort zurücksetzen',
          categories: ['account', 'passwordReset'],
          template: 'account-password-reset',
          variables: {
            gliederung: findRes.person.gliederung!.name,
            name: `${findRes.person.firstname} ${findRes.person.lastname}`,
            hostname: 'brahmsee.digital',
            veranstaltung: 'brahmsee.digital',
            resetUrl,
          },
        })
      }
      return {
        status: true,
        process: 'sendResetToken',
      }
    } else if (
      options.input.email == null &&
      options.input.passwordResetToken != null &&
      options.input.password != null
    ) {
      // Reset Password with Token
      const findRes = await prisma.account.findUnique({
        where: {
          passwordResetToken: options.input.passwordResetToken,
        },
        select: {
          id: true,
          passwordResetToken: true,
        },
      })

      if (findRes == null)
        return {
          status: true,
        }

      await prisma.account.update({
        where: {
          id: findRes.id,
        },
        data: {
          password: await hashPassword(options.input.password),
          passwordResetToken: null,
        },
      })

      return {
        status: true,
        process: 'setNewPassword',
      }
    }
  },
})
