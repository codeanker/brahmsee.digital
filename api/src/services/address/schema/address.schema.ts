import { z } from 'zod'

import prisma from '../../../prisma'
import { isAllUndefined } from '../../../util/object'

export const addressSchema = z.strictObject({
  street: z.string().optional(),
  number: z.string().optional(),
  zip: z.string().optional(),
  city: z.string().optional(),
})

export async function findAddress(input: z.infer<typeof addressSchema>) {
  return await prisma.address.findFirst({
    where: {
      city: input.city,
      zip: input.zip,
      street: input.street,
      number: input.number,
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
    number: input.number!,
  }
  const existing = await findAddress(data)

  if (existing === null) {
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
