import { z } from 'zod'

export const addressInput = z.strictObject({
  street: z.string(),
  number: z.string(),
  zip: z.string(),
  city: z.string(),
})
