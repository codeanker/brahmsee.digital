import { z } from 'zod'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import prisma from '../../prisma.js'
import logActivity from '../../util/activity.js'
import { TRPCError } from '@trpc/server'
import { sendMail } from '../../util/mail.js'

export const requestGliederungAdminDecideProcedure = defineProtectedMutateProcedure({
  key: 'requestGliederungAdminDecide',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.strictObject({
    token: z.string().uuid().optional(),
    requestId: z.number().int(),
    decision: z.boolean(),
  }),
  handler: async ({ ctx, input: { token, requestId, decision } }) => {
    if (ctx.account?.role === 'GLIEDERUNG_ADMIN' && token === undefined) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'token is required',
      })
    }

    const request = await prisma.gliederungToAccount.findUnique({
      where: {
        id: requestId,
        confirmByGliederungToken: ctx.account?.role === 'ADMIN' ? undefined : token,
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
      await prisma.gliederungToAccount.delete({
        where: {
          id: requestId,
        },
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
        const { accountId } = await tx.gliederungToAccount.update({
          where: {
            id: requestId,
          },
          data: {
            confirmByGliederungToken: null,
            confirmedByGliederung: true,
            confirmedAt: new Date(),
          },
          select: {
            accountId: true,
          },
        })
        await tx.account.update({
          where: {
            id: accountId,
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
