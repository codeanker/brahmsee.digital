import z from 'zod'

import prisma from '../../prisma'
import { defineQuery } from '../../types/ZQuery'

export const ZGliederungManagementListInputSchema = defineQuery({
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
      name: options.input.filter.name,
    },
    select: {
      id: true,
      name: true,
      edv: true,
      bezirk: {
        select: {
          id: true,
          name: true,
        },
      },
      landesverband: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  })
  return list
}
