import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZGliederungVerwaltungGetInputSchema = z.strictObject({
  id: z.number(),
})

export type TGliederungVerwaltungGetInputSchema = z.infer<typeof ZGliederungVerwaltungGetInputSchema>

type GliederungVerwaltungGetOptions = AuthenticatedContext & {
  input: TGliederungVerwaltungGetInputSchema
}

export async function gliederungVerwaltungGet(options: GliederungVerwaltungGetOptions) {
  return prisma.gliederung.findUniqueOrThrow({
    where: {
      id: options.input.id,
    },
    select: {
      id: true,
      name: true,
      edv: true,
    },
  })
}
