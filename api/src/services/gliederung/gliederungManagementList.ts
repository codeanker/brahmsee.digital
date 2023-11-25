import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'
import { defineQuery } from '../../types/ZQuery'

export const ZGliederungManagementListInputSchema = defineQuery({
  filter: z.strictObject({
    name: z.string().optional(),
  }),
})

export type TGliederungManagementListInputSchema = z.infer<typeof ZGliederungManagementListInputSchema>

type GliederungManagementListOptions = AuthenticatedContext & {
  input: TGliederungManagementListInputSchema
}

export async function gliederungManagementList(options: GliederungManagementListOptions) {
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
