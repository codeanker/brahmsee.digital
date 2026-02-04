import z from 'zod'

import { groupBy } from '@codeanker/helpers'
import prisma from '../../prisma.js'
import { defineProtectedQueryProcedure } from '../../types/defineProcedure.js'

export async function listFaqs(unterveranstaltungId: string) {
  const list = await prisma.faq.findMany({
    where: {
      unterveranstaltung: {
        every: {
          id: unterveranstaltungId,
        },
      },
    },
    select: {
      id: true,
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

export const faqListProcedure = defineProtectedQueryProcedure({
  key: 'list',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
  inputSchema: z.strictObject({
    unterveranstaltungId: z.string().uuid(),
  }),
  handler: ({ input }) => listFaqs(input.unterveranstaltungId),
})

export const faqCategorySearchProcedure = defineProtectedQueryProcedure({
  key: 'searchCategory',
  roleIds: ['ADMIN', 'GLIEDERUNG_ADMIN'],
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
