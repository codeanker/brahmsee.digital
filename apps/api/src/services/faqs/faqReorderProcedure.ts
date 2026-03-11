import z from 'zod'

import prisma from '../../prisma.js'
import { TRPCError } from '@trpc/server'
import { Role } from '@prisma/client'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { getGliederungRequireAdmin } from '../../util/getGliederungRequireAdmin.js'

export const faqReorderProcedure = defineProtectedMutateProcedure({
  key: 'reorder',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.strictObject({
    faqOrder: z.array(
      z.strictObject({
        id: z.string().uuid(),
        sortOrder: z.number().int().min(0),
        categoryId: z.string().uuid(),
      })
    ),
    categoryOrder: z.array(
      z.strictObject({
        id: z.string().uuid(),
        sortOrder: z.number().int().min(0),
      })
    ),
  }),
  handler: async ({ ctx, input: { faqOrder, categoryOrder } }) => {
    /// Check permissions for FAQs and categories
    if (ctx.account.role !== Role.ADMIN) {
      const gliederung = await getGliederungRequireAdmin(ctx.accountId)
      const unterveranstaltungIds = (
        await prisma.unterveranstaltung.findMany({
          where: { gliederungId: gliederung.id },
          select: { id: true },
        })
      ).map((u) => u.id)

      const faqs = await prisma.faq.findMany({
        where: { id: { in: faqOrder.map((f) => f.id) } },
        select: {
          id: true,
          unterveranstaltung: {
            select: {
              id: true,
            },
          },
        },
      })
      for (const faq of faqs) {
        const unterveranstaltungId = faq.unterveranstaltung[0]?.id
        if (!unterveranstaltungId || !unterveranstaltungIds.includes(unterveranstaltungId)) {
          throw new TRPCError({ code: 'FORBIDDEN', message: `FAQ '${faq.id}' do not belong to accounts gliederung` })
        }
      }

      const categoryIds = [...new Set([...categoryOrder.map((c) => c.id), ...faqOrder.map((f) => f.categoryId)])]
      const categories = await prisma.faqCategory.findMany({
        where: { id: { in: categoryIds } },
        select: {
          id: true,
          unterveranstaltung: {
            select: {
              id: true,
            },
          },
        },
      })
      for (const category of categories) {
        const unterveranstaltungId = category.unterveranstaltung.id
        if (!unterveranstaltungId || !unterveranstaltungIds.includes(unterveranstaltungId)) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `FAQ Category '${category.id}' do not belong to accounts gliederung`,
          })
        }
      }
    }

    /// Perform updates in a transaction
    await prisma.$transaction([
      ...faqOrder.map(({ id, sortOrder, categoryId }) =>
        prisma.faq.update({
          where: { id },
          data: { sortOrder, categoryId },
        })
      ),
      ...categoryOrder.map(({ id, sortOrder }) =>
        prisma.faqCategory.update({
          where: { id },
          data: { sortOrder },
        })
      ),
    ])
  },
})
