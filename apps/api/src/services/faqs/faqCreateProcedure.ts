import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { faqSchema } from './faqs.schema.js'

export const faqCreateProcedure = defineProtectedMutateProcedure({
  key: 'create',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.strictObject({
    unterveranstaltungId: z.string().uuid(),
    faq: faqSchema,
  }),
  handler: async ({ input: { faq, unterveranstaltungId } }) => {
    const [maxCategoryOrder, maxFaqOrder] = await Promise.all([
      prisma.faqCategory.aggregate({
        where: { unterveranstaltungId },
        _max: { order: true },
      }),
      prisma.faq.aggregate({
        where: { category: { unterveranstaltungId } },
        _max: { order: true },
      }),
    ])

    await prisma.faq.create({
      data: {
        question: faq.question,
        answer: faq.answer,
        order: (maxFaqOrder._max.order ?? -1) + 1,
        unterveranstaltung: {
          connect: {
            id: unterveranstaltungId,
          },
        },
        category: {
          connectOrCreate: {
            create: {
              name: faq.category,
              unterveranstaltungId,
              order: (maxCategoryOrder._max.order ?? -1) + 1,
            },
            where: {
              name_unterveranstaltungId: {
                name: faq.category,
                unterveranstaltungId,
              },
            },
          },
        },
      },
    })
  },
})
