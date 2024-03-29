import { Role, AccountStatus } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma'
import { defineProcedure } from '../../types/defineProcedure'
import logActivity from '../../util/activity'
import { sendMail } from '../../util/mail'

export const accountVerwaltungPatchProcedure = defineProcedure({
  key: 'verwaltungPatch',
  method: 'mutation',
  protection: { type: 'restrictToRoleIds', roleIds: ['ADMIN'] },
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
        html: `Hallo ${account.person.firstname} ${account.person.lastname},\n\n\nDein Accountstatus wurde auf ${account.status} geändert.\n\nViele Grüße,\nDein Orga-Team`,
      })
    }

    return account
  },
})
