import { z } from 'zod'

export const kontaktInput = z.strictObject({
  firstname: z.string(),
  lastname: z.string(),
  telefon: z.string(),
})

export type TKontaktInput = z.infer<typeof kontaktInput>
