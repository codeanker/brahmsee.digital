import z from 'zod'

import prisma from '../../prisma'
import type { AuthenticatedContext } from '../../trpc'
import { addressSchema } from '../address/schema/address.schema'

export const ZOrtVerwaltungCreateInputSchema = z.strictObject({
  data: z.strictObject({
    name: z.string(),
    address: addressSchema.optional(),
  }),
})

export type TOrtVerwaltungCreateInputSchema = z.infer<typeof ZOrtVerwaltungCreateInputSchema>

type OrtVerwaltungCreateOptions = AuthenticatedContext & {
  input: TOrtVerwaltungCreateInputSchema
}

export async function ortVerwaltungCreate(options: OrtVerwaltungCreateOptions) {
  return prisma.ort.create({
    data: {
      name: options.input.data.name,
      address: options.input.data.address
        ? {
            create: options.input.data.address,
          }
        : undefined,
    },
    select: {
      id: true,
    },
  })
}
