import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'
import { sendMail } from '../../util/mail.js'

export const requestGliederungAdminDecideProcedure = defineProtectedMutateProcedure({
  key: 'requestGliederungAdminDecide',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.strictObject({
    requestId: z.number().int(),
    decision: z.boolean(),
  }),
  handler: async ({ ctx, input: { requestId, decision } }) => {
    let gliederungId: string | undefined = undefined
    if (ctx.account.role === 'GLIEDERUNG_ADMIN') {
      const gliederung = await getGliederungRequireAdmin(ctx.accountId)
      gliederungId = gliederung.id
    }

    const request = await prisma.gliederungToAccount.findUnique({
      where: {
        id: requestId,
        gliederungId,
      },
      select: {
        id: true,
        accountId: true,
        account: {
          select: {
            status: true,
            email: true,
            person: {
              select: {
                firstname: true,
                lastname: true,
              },
            },
          },
        },
        gliederung: {
          select: {
            name: true,
          },
        },
      },
    })
    if (request === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      })
    }

    if (!decision) {
      await prisma.$transaction(async (tx) => {
        await tx.gliederungToAccount.delete({
          where: {
            id: requestId,
          },
        })
        await tx.account.update({
          where: {
            id: request.accountId,
          },
          data: {
            role: 'USER',
          },
        })
      })

      await logActivity({
        type: 'DELETE',
        subjectType: 'gliederungtoaccount',
        subjectId: `${request.id}`,
        description: `Eine Zugriffsanfrage auf die Gliederung ${request.gliederung.name} wurde abgelehnt.`,
        causerId: ctx.accountId,
      })
    } else {
      await prisma.$transaction(async (tx) => {
        await tx.gliederungToAccount.update({
          where: {
            id: requestId,
          },
          data: {
            confirmByGliederungToken: null,
            confirmedByGliederung: true,
            confirmedAt: new Date(),
          },
        })
        await tx.account.update({
          where: {
            id: request.accountId,
          },
          data: {
            role: 'GLIEDERUNG_ADMIN',
          },
        })
      })

      await logActivity({
        type: 'UPDATE',
        subjectType: 'account',
        subjectId: request.accountId,
        description: `Account ${request.account.email} ist jetzt Gliederungsadmin der Gliederung ${request.gliederung.name}`,
        causerId: ctx.accountId,
      })
    }

    await sendMail({
      to: request.account.email,
      categories: ['access', 'gliederung'],
      template: 'gliederung-access-request-decision',
      subject: `Zugriffsanfrage auf deine Gliederung ${decision ? 'bestätigt' : 'abgelehnt'}`,
      variables: {
        hostname: 'brahmsee.digital',
        gliederung: request.gliederung.name,
        name: `${request.account.person.firstname} ${request.account.person.lastname}`,
        veranstaltung: 'Zugriffsanfrage',
        decision,
      },
    })

    return decision
  },
})
