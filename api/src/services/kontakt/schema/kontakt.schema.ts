import { z } from 'zod'

export const kontaktSchema = z.strictObject({
  firstname: z.string(),
  lastname: z.string(),
  telefon: z.string(),
})

export type TKontaktSchema = z.infer<typeof kontaktSchema>
