import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'
import { defineQuery } from '../../types/ZQuery'

export const ZGliederungVerwaltungListInputSchema = defineQuery({
  filter: z.strictObject({
    name: z.string().optional(),
  }),
})

export type TGliederungVerwaltungListInputSchema = z.infer<typeof ZGliederungVerwaltungListInputSchema>

type GliederungVerwaltungListOptions = AuthenticatedContext & {
  input: TGliederungVerwaltungListInputSchema
}

export async function gliederungVerwaltungList(options: GliederungVerwaltungListOptions) {
  const { skip, take } = options.input.pagination
  const list = await prisma.gliederung.findMany({
    skip,
    take,
    where: {
      name: options.input.filter.name,
    },
    select: {
      id: true,
      name: true,
      edv: true,
    },
  })
  return list
}
