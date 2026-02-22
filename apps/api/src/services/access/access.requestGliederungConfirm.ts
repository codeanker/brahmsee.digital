import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import prisma from '../../prisma.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import logActivity from '../../util/activity.js'
import { sendMail } from '../../util/mail.js'

export const requestGliederungAdminConfirmProcedure = definePublicMutateProcedure({
  key: 'requestGliederungAdminConfirm',
  inputSchema: z.strictObject({
    token: z.string().uuid(),
    decision: z.boolean(),
  }),
  handler: async ({ ctx, input: { token, decision } }) => {
    const request = await prisma.gliederungToAccount.findFirst({
      where: {
        confirmByGliederungToken: token,
      },
      select: {
        id: true,
        accountId: true,
        account: {
          select: {
            email: true,
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
            id: request.id,
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
        await tx.gliederungToAccount.updateMany({
          where: {
            confirmByGliederungToken: token,
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
        name: `${ctx.account?.person.firstname} ${ctx.account?.person.lastname}`,
        veranstaltung: 'Zugriffsanfrage',
        decision,
      },
    })

    return decision
  },
})
