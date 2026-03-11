import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'
import { TRPCError } from '@trpc/server'

export const faqDeleteProcedure = defineProtectedMutateProcedure({
  key: 'delete',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.string().uuid(),
  handler: async ({ ctx, input }) => {
    const gliederung = await getGliederungRequireAdmin(ctx.accountId)
    const unterveranstaltungIds = (
      await prisma.unterveranstaltung.findMany({
        where: { gliederungId: gliederung.id },
        select: { id: true },
      })
    ).map((u) => u.id)

    const faq = await prisma.faq.findUnique({
      where: {
        id: input,
        unterveranstaltung: {
          every: {
            id: { in: unterveranstaltungIds },
          },
        },
      },
      select: {
        id: true,
      },
    })
    if (!faq) {
      throw new TRPCError({ code: 'FORBIDDEN', message: `FAQ do not belong to accounts gliederung` })
    }

    await prisma.faq.delete({
      where: {
        id: input,
      },
    })

    // delete empty categories
    await prisma.faqCategory.deleteMany({
      where: {
        faqs: {
          every: {
            id: input,
          },
        },
      },
    })
  },
})
