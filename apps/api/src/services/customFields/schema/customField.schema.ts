import { CustomFieldPosition, CustomFieldType } from '@prisma/client'
import { z } from 'zod'

export const customFieldSchema = z
  .strictObject({
    name: z.string().min(1),
    description: z.string().nullable(),
    type: z.nativeEnum(CustomFieldType),
    required: z.boolean(),
    options: z.array(z.string()),
    positions: z.nativeEnum(CustomFieldPosition).array().min(1),
  })
  .superRefine((values, ctx) => {
    const optionTypes = ['BASIC_DROPDOWN', 'BASIC_RADIO', 'BASIC_SWITCH'] as CustomFieldType[]
    if (optionTypes.includes(values.type) && values.options.length === 0) {
      ctx.addIssue({
        code: 'custom',
        message: 'Es muss mindestens eine Auswahlmöglichkeit angegeben werden',
      })
    }
  })
