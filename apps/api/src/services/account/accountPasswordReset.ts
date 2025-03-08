import { v4 as uuidv4 } from 'uuid'
import z from 'zod'

import config from '../../config.js'
import prisma from '../../prisma.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import { sendMail } from '../../util/mail.js'

import { hashPassword } from '@codeanker/authentication'
import { TRPCError } from '@trpc/server'

export const accountPasswordResetProcedure = definePublicMutateProcedure({
  key: 'resetPassword',
  inputSchema: z.discriminatedUnion('type', [
    z.strictObject({
      type: z.literal('request'),
      email: z.string(),
    }),
    z.strictObject({
      type: z.literal('reset'),
      token: z.string(),
      password: z.string(),
    }),
  ]),
  async handler({ input }) {
    // Create Reset Token and send per Mail
    if (input.type === 'request') {
      const findRes = await prisma.account.findUnique({
        where: {
          email: input.email,
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
            email: input.email,
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
    }

    // Reset Password with Token
    if (input.type === 'reset') {
      const findRes = await prisma.account.findUnique({
        where: {
          passwordResetToken: input.token,
        },
        select: {
          id: true,
          passwordResetToken: true,
        },
      })

      if (findRes == null) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
        })
      }

      await prisma.account.update({
        where: {
          id: findRes.id,
        },
        data: {
          password: await hashPassword(input.password),
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
