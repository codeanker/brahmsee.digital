import { AccountStatus, Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'
import { sendMail } from '../../util/mail.js'
import { AccountStatusMapping } from '../../types/enums/mappings/AccountStatus.js'

export const accountVerwaltungPatchProcedure = defineProtectedMutateProcedure({
  key: 'verwaltungPatch',
  roleIds: [Role.ADMIN],
  inputSchema: z.strictObject({
    id: z.number().int(),
    data: z.strictObject({
      email: z.string().email(),
      role: z.nativeEnum(Role),
      status: z.nativeEnum(AccountStatus).optional(),
    }),
  }),
  async handler(options) {
    const oldAccount = await prisma.account.findUniqueOrThrow({
      where: {
        id: options.input.id,
      },
      select: {
        status: true,
      },
    })

    const account = await prisma.account.update({
      where: {
        id: options.input.id,
      },
      data: options.input.data,
      select: {
        id: true,
        status: true,
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

    if (oldAccount.status !== account.status) {
      await logActivity({
        type: 'UPDATE',
        description: `Account Status geändert auf ${account.status}`,
        subjectType: 'account',
        subjectId: account.id,
        causerId: options.ctx.accountId,
      })

      await sendMail({
        to: account.email,
        subject: `Account ${account.status}`,
        categories: ['account', 'status'],
        template: 'account-status-changed',
        variables: {
          name: `${account.person.firstname} ${account.person.lastname}`,
          gliederung: account.person.gliederung!.name,
          hostname: 'brahmsee.digital',
          veranstaltung: 'brahmsee.digital',
          status: AccountStatusMapping[account.status].human,
          isActive: account.status === AccountStatus.AKTIV,
        },
      })
    }

    return account
  },
})
