import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZGliederungVerwaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    name: z.string(),
    edv: z.string(),
    landesverbandId: z.number(),
  }),
})

export type TGliederungVerwaltungCreateInputSchema = z.infer<typeof ZGliederungVerwaltungCreateInputSchema>

type GliederungVerwaltungCreateOptions = AuthenticatedContext & {
  input: TGliederungVerwaltungCreateInputSchema
}

export async function gliederungVerwaltungCreate(options: GliederungVerwaltungCreateOptions) {
  return prisma.gliederung.create({
    data: options.input.data,
    select: {
      id: true,
    },
  })
}
