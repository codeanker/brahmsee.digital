import { z } from 'zod'

export const faqSchema = z.strictObject({
  question: z.string(),
  answer: z.string(),
  category: z.string(),
})

export const faqUpdateSchema = faqSchema.partial()
