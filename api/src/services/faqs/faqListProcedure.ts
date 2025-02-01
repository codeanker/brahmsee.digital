import z from 'zod'

import prisma from '../../prisma.js'
import { definePublicQueryProcedure } from '../../types/defineProcedure.js'
import { groupBy } from '@codeanker/helpers'

export async function listFaqs(unterveranstaltungId: number) {
  const list = await prisma.faq.findMany({
    where: {
      unterveranstaltung: {
        every: {
          id: unterveranstaltungId,
        },
      },
    },
    select: {
      question: true,
      answer: true,
      category: {
        select: {
          name: true,
        },
      },
    },
  })

  return groupBy(list, ({ category }) => category.name)
}

export const faqListProcedure = definePublicQueryProcedure({
  key: 'list',
  inputSchema: z.strictObject({
    unterveranstaltungId: z.number().int(),
  }),
  handler: ({ input }) => listFaqs(input.unterveranstaltungId),
})
