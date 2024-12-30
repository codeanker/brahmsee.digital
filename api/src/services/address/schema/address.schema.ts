import { z } from 'zod'

import prisma from "../../../prisma.js"
import { isAllUndefined } from "../../../util/object.js"

export const addressSchema = z.strictObject({
  street: z.string().optional(),
  streetNumber: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  valid: z.boolean().optional(),
  position: z
    .strictObject({
      lat: z.number(),
      lon: z.number(),
    })
    .optional(),
})

export async function findAddress(input: z.infer<typeof addressSchema>) {
  return await prisma.address.findFirst({
    where: {
      city: input.city,
      zip: input.zip,
      street: input.street,
      streetNumber: input.streetNumber,
    },
  })
}

export async function createOrUpdateAddress(input: z.infer<typeof addressSchema>): Promise<number | undefined> {
  if (isAllUndefined(input)) {
    return undefined
  }

  const data = {
    zip: input.zip!,
    city: input.city!,
    street: input.street!,
    streetNumber: input.streetNumber!,
    country: input.country!,
    valid: input.valid,
    lat: input.position?.lat,
    lon: input.position?.lon,
  }
  const existing = await findAddress(data)

  if (!existing) {
    const result = await prisma.address.create({
      data,
      select: {
        id: true,
      },
    })
    return result.id
  } else {
    const result = await prisma.address.update({
      data,
      where: {
        id: existing.id,
      },
      select: {
        id: true,
      },
    })
    return result.id
  }
}
