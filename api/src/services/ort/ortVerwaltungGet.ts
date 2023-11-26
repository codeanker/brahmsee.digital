import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'

export const ZOrtVerwaltungGetInputSchema = z.strictObject({
  id: z.number().int(),
})

export type TOrtVerwaltungGetInputSchema = z.infer<typeof ZOrtVerwaltungGetInputSchema>

type OrtVerwaltungGetOptions = AuthenticatedContext & {
  input: TOrtVerwaltungGetInputSchema
}

export async function ortVerwaltungGet(options: OrtVerwaltungGetOptions) {
  return prisma.ort.findFirstOrThrow({
    where: {
      id: options.input.id,
    },
    select: {
      id: true,
      name: true,
      address: true,
    },
  })
}
