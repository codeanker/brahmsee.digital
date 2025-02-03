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

  const groups = groupBy(
    list.map((v) => ({ ...v, category: v.category.name })),
    ({ category }) => category
  )

  return Object.fromEntries(Object.entries(groups).sort(([a], [b]) => a.localeCompare(b)))
}

export const faqListProcedure = definePublicQueryProcedure({
  key: 'list',
  inputSchema: z.strictObject({
    unterveranstaltungId: z.number().int(),
  }),
  handler: ({ input }) => listFaqs(input.unterveranstaltungId),
})

export const faqCategorySearchProcedure = definePublicQueryProcedure({
  key: 'searchCategory',
  inputSchema: z.strictObject({
    term: z.string().optional(),
  }),
  handler: async ({ input: { term } }) => {
    const result = await prisma.faqCategory.findMany({
      take: 10,
      orderBy: {
        name: 'asc',
      },
      where: {
        name: {
          contains: term,
        },
      },
      select: {
        name: true,
      },
    })

    return result.map((c) => c.name)
  },
})
