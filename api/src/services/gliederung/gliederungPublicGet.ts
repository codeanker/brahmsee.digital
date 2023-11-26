import z from 'zod'

import prisma from '../../prisma'

export const ZGliederungPublicGetInputSchema = z.strictObject({
  gliederungId: z.number().int(),
})

export type TGliederungPublicGetInputSchema = z.infer<typeof ZGliederungPublicGetInputSchema>

type GliederungPublicGetOptions = {
  input: TGliederungPublicGetInputSchema
}

export async function gliederungPublicGet(options: GliederungPublicGetOptions) {
  return prisma.gliederung.findUniqueOrThrow({
    where: {
      id: options.input.gliederungId,
    },
    select: {
      name: true,
    },
  })
}
