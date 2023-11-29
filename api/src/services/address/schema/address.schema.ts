import { z } from 'zod'

export const addressSchema = z.strictObject({
  street: z.string(),
  number: z.string(),
  zip: z.string(),
  city: z.string(),
})
