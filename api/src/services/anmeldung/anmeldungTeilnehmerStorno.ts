import { Role } from '@prisma/client'
import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'

export const anmeldungTeilnehmerStornoProcedure = defineProtectedProcedure({
  key: 'teilnehmerStorno',
  method: 'mutation',
  roleIds: [Role.GLIEDERUNG_ADMIN],
  inputSchema: z.strictObject({
    data: z.strictObject({
      anmeldungId: z.number().int(),
    }),
  }),
  async handler(options) {
    const res = await prisma.anmeldung.update({
      where: {
        id: options.input.data.anmeldungId,
        person: {
          is: {
            account: {
              is: {
                id: options.ctx.accountId,
              },
            },
          },
        },
      },
      data: {
        status: 'STORNIERT',
      },
      select: {
        id: true,
      },
    })

    await logActivity({
      type: 'UPDATE',
      description: `registration canceled`,
      subjectType: 'anmeldung',
      subjectId: res.id,
      causerId: options.ctx.accountId,
    })
  },
})
