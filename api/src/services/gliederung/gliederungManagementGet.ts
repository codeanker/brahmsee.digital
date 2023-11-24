import z from 'zod'

import prisma from '../../prisma'

export const ZGliederungManagementGetInputSchema = z.strictObject({
  id: z.number(),
})

export type TGliederungManagementGetInputSchema = z.infer<typeof ZGliederungManagementGetInputSchema>

type GliederungManagementGetOptions = {
  input: TGliederungManagementGetInputSchema
}

export async function gliederungManagementGet(options: GliederungManagementGetOptions) {
  return prisma.gliederung.findFirstOrThrow({
    where: {
      id: options.input.id,
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
}
