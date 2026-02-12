import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { TRPCError } from '@trpc/server'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

export const unterveranstaltungDeleteProcedure = defineProtectedMutateProcedure({
  key: 'delete',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.strictObject({
    id: z.string().uuid(),
  }),
  handler: async ({ ctx, input: { id } }) => {
    if (ctx.account.role === 'GLIEDERUNG_ADMIN') {
      await getGliederungRequireAdmin(ctx.accountId)
    }

    const unterveranstaltung = await prisma.unterveranstaltung.findUnique({
      where: {
        id,
      },
      select: {
        beschreibung: true,
        gliederung: {
          select: {
            name: true,
          },
        },
      },
    })
    if (unterveranstaltung === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      })
    }

    await prisma.$transaction(async (tx) => {
      await tx.anmeldung.deleteMany({
        where: {
          unterveranstaltung: {
            id,
          },
        },
      })
      await tx.faq.deleteMany({
        where: {
          unterveranstaltung: {
            every: {
              id,
            },
          },
        },
      })
      await tx.faqCategory.deleteMany({
        where: {
          unterveranstaltung: {
            id,
          },
        },
      })
      await tx.unterveranstaltung.deleteMany({
        where: {
          id,
        },
      })

      await tx.activity.create({
        data: {
          type: 'DELETE',
          causerId: ctx.accountId,
          subjectType: 'unterveranstaltung',
          subjectId: id,
          createdAt: new Date(),
          description: `Ausschreibung "${unterveranstaltung.beschreibung ?? unterveranstaltung.gliederung.name}" gelöscht`,
        },
      })
    })
  },
})
