import { z } from 'zod'

export const kontaktDto = z.strictObject({
  firstname: z.string(),
  lastname: z.string(),
  telefon: z.string(),
})

export type TKontaktDto = z.infer<typeof kontaktDto>
