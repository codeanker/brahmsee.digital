import { QualificationSanitaeter } from '@prisma/client'

import { defineEnumMapping } from "../defineEnumMapping.js"

export const QualificationSanitaeterMapping = defineEnumMapping<QualificationSanitaeter>({
  AUSBILDER: { human: 'Ausbilder' },
  FORTBILDUNG: { human: 'Fortbildung' },
  SAN_A: { human: 'San A' },
  SAN_B: { human: 'San B' },
})
