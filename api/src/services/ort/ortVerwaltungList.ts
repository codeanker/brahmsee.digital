import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'
import { defineQuery } from '../../types/ZQuery'

export const ZOrtVerwaltungListInputSchema = defineQuery({
  filter: z.strictObject({
    name: z.string().optional(),
  }),
})

export type TOrtVerwaltungListInputSchema = z.infer<typeof ZOrtVerwaltungListInputSchema>

type OrtVerwaltungListOptions = AuthenticatedContext & {
  input: TOrtVerwaltungListInputSchema
}

export async function ortVerwaltungList(options: OrtVerwaltungListOptions) {
  const { skip, take } = options.input.pagination

  return await prisma.ort.findMany({
    skip,
    take,
    where: {
      name: options.input.filter.name,
    },
    select: {
      id: true,
      name: true,
    },
  })
}
