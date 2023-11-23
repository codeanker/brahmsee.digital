import z from 'zod'

import prisma from '../../prisma'
import { ZQuerySchema } from '../../types/ZQuery'

export const ZGliederungManagementListInputSchema = ZQuerySchema({
  filter: z.strictObject({
    name: z.string().optional(),
  }),
})

export type TGliederungManagementListInputSchema = z.infer<typeof ZGliederungManagementListInputSchema>

type GliederungManagementListOptions = {
  input: TGliederungManagementListInputSchema
}

export async function gliederungManagementList(options: GliederungManagementListOptions) {
  const { skip, take } = options.input.pagination
  const list = await prisma.gliederung.findMany({
    skip,
    take,
    where: {
      name: options.input.filter.email,
    },
  })
  return list
}