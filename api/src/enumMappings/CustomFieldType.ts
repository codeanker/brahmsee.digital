import { CustomFieldType } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping'

export const CustomFieldTypeMapping = defineEnumMapping<CustomFieldType>({
  TEXT: { human: 'Text' },
  INT: { human: 'Ganzzahl' },
  FLOAT: { human: 'Dezimalzahl' },
  BOOLEAN: { human: 'Checkbox' },
})

export { type CustomFieldType }
