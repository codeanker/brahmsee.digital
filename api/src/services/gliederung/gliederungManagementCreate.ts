import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZGliederungManagementCreateInputSchema = z.strictObject({
  data: z.strictObject({
    name: z.string(),
    edv: z.string(),
    landesverbandId: z.number(),
  }),
})

export type TGliederungManagementCreateInputSchema = z.infer<typeof ZGliederungManagementCreateInputSchema>

type GliederungManagementCreateOptions = AuthenticatedContext & {
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
