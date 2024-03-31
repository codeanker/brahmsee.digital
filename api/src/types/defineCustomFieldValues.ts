import { Prisma } from '@prisma/client'
import { z } from 'zod'

export function defineCustomFieldValues() {
  return z.array(
    z.strictObject({
      fieldId: z.number().int(),
      value: z.union([z.string(), z.boolean(), z.undefined()]),
    })
  )
}

export function customFieldValuesCreateMany(data) {
  const customField: Prisma.CustomFieldValueCreateManyArgs = {
    data: data.map((field) => {
      return {
        fieldId: field.fieldId,
        value: field.value.toString(),
      }
    }),
  }

  return customField
}
