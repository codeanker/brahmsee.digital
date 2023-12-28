import { z } from 'zod'

import prisma from '../../../prisma'

export const addressSchema = z.strictObject({
  street: z.string().optional(),
  number: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
})

export async function findAddress(input: z.infer<typeof addressSchema>) {
  return await prisma.address.findFirst({
    where: {
      AND: {
        city: input.city,
        zip: input.zip,
        street: input.street,
        number: input.number,
      },
    },
  })
}
