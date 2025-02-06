import { CustomFieldPosition, CustomFieldType } from '@prisma/client'
import { z } from 'zod'

export const customFieldSchema = z.strictObject({
  name: z.string().min(1),
  description: z.string().nullable(),
  type: z.nativeEnum(CustomFieldType),
  required: z.boolean(),
  options: z.array(z.string()),
  positions: z.nativeEnum(CustomFieldPosition).array(),
})
