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
    await prisma.faq.create({
      data: {
        question: faq.question,
        answer: faq.answer,
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
