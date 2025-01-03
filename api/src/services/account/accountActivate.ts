import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'
import { sendMail } from '../../util/mail.js'

export const accountActivateProcedure = defineProtectedMutateProcedure({
  key: 'activate',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    accountId: z.number().int(),
  }),
  async handler(options) {
    const account = await prisma.account.update({
      where: {
        id: options.input.accountId,
      },
      data: {
        activatedAt: new Date(),
      },
      select: {
        email: true,
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

    await logActivity({
      type: 'UPDATE',
      description: `account was activated`,
      subjectType: 'account',
      subjectId: options.input.accountId,
      causerId: options.ctx.accountId,
    })

    await sendMail({
      to: account.email,
      subject: 'Account aktiviert',
      categories: ['account', 'activate'],
      template: 'account-activated',
      variables: {
        gliederung: account.person.gliederung!.name,
        name: `${account.person.firstname} ${account.person.lastname}`,
        hostname: 'brahmsee.digital',
        veranstaltung: 'brahmsee.digital',
      },
    })

    return 'activated'
  },
})
