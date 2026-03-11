import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

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
  handler: async ({ input: { faqOrder, categoryOrder } }) => {
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
