import z from 'zod'

import prisma from '../../prisma.js'
import { defineProtectedMutateProcedure } from '../../types/defineProcedure.js'

export const faqDeleteProcedure = defineProtectedMutateProcedure({
  key: 'delete',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.number().int(),
  handler: async ({ input }) => {
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
