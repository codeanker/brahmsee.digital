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
    orderBy: {
      sortOrder: 'asc',
    },
    select: {
      id: true,
      question: true,
      answer: true,
      sortOrder: true,
      category: {
        select: {
          id: true,
          name: true,
          sortOrder: true,
        },
      },
    },
  })

  const groups = groupBy(
    list.map((v) => ({
      ...v,
      category: v.category.name,
      categoryId: v.category.id,
      categorySortOrder: v.category.sortOrder,
    })),
    ({ category }) => category
  )

  return Object.fromEntries(
    Object.entries(groups).sort(([, a], [, b]) => (a[0]?.categorySortOrder ?? 0) - (b[0]?.categorySortOrder ?? 0))
  )
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
