import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicMutateProcedure } from '../../types/defineProcedure.js'
import { faqSchema } from './faqs.schema.js'

export const faqUpdateProcedure = definePublicMutateProcedure({
  key: 'update',
  inputSchema: z.strictObject({
    id: z.number().int(),
    unterveranstaltungId: z.number().int(),
    faq: faqSchema,
  }),
  handler: async ({ input: { id, unterveranstaltungId, faq } }) => {
    await prisma.faq.update({
      where: {
        id,
      },
      data: {
        question: faq.question,
        answer: faq.answer,
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
