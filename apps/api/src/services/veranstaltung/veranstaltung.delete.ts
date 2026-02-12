import { z } from 'zod'
import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { TRPCError } from '@trpc/server'

export const veranstaltungDeleteProcedure = defineProtectedMutateProcedure({
  key: 'delete',
  roleIds: ['ADMIN'],
  inputSchema: z.strictObject({
    veranstaltungId: z.string().uuid(),
  }),
  handler: async ({ ctx, input: { veranstaltungId } }) => {
    const veranstaltung = await prisma.veranstaltung.findUnique({
      where: {
        id: veranstaltungId,
      },
      select: {
        name: true,
      },
    })
    if (veranstaltung === null) {
      throw new TRPCError({
        code: 'NOT_FOUND',
      })
    }

    await prisma.$transaction(async (tx) => {
      await tx.programmPunkt.deleteMany({
        where: {
          veranstaltungId,
        },
      })
      await tx.anmeldung.deleteMany({
        where: {
          unterveranstaltung: {
            veranstaltungId,
          },
        },
      })
      await tx.faq.deleteMany({
        where: {
          unterveranstaltung: {
            every: {
              veranstaltungId,
            },
          },
        },
      })
      await tx.faqCategory.deleteMany({
        where: {
          unterveranstaltung: {
            veranstaltungId,
          },
        },
      })
      await tx.unterveranstaltung.deleteMany({
        where: {
          veranstaltungId,
        },
      })

      await tx.veranstaltung.delete({
        where: {
          id: veranstaltungId,
        },
      })
      await tx.activity.create({
        data: {
          type: 'DELETE',
          causerId: ctx.accountId,
          subjectType: 'veranstaltung',
          subjectId: veranstaltungId,
          createdAt: new Date(),
          description: `Veranstaltung "${veranstaltung.name}" gelöscht`,
        },
      })
    })
  },
})
