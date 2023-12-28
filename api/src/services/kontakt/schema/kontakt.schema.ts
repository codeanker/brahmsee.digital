import { z } from 'zod'

export const kontaktSchema = z.strictObject({
  firstname: z.string(),
  lastname: z.string(),
  telefon: z.string(),
  isNotfallKontakt: z.boolean(),
})

export type TKontaktSchema = z.infer<typeof kontaktSchema>
