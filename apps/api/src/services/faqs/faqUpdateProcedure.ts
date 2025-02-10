import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'
import { faqSchema } from './faqs.schema.js'

export const faqUpdateProcedure = defineProtectedMutateProcedure({
  key: 'update',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
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
