import z from 'zod'

import prisma from '../../prisma'

export const ZGliederungManagementCreateInputSchema = z.strictObject({
  data: z.strictObject({
    name: z.string(),
    edv: z.number(),
  }),
})

export type TGliederungManagementCreateInputSchema = z.infer<typeof ZGliederungManagementCreateInputSchema>

type GliederungManagementCreateOptions = {
  input: TGliederungManagementCreateInputSchema
}

export async function gliederungManagementCreate(options: GliederungManagementCreateOptions) {
  return prisma.gliederung.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
