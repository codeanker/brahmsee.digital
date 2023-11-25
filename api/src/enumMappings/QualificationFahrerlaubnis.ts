import { QualificationFahrerlaubnis } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping'

export const QualificationFahrerlaubnisMapping = defineEnumMapping<QualificationFahrerlaubnis>({
  B: { human: 'B' },
  BE: { human: 'BE' },
  C: { human: 'C' },
  CE: { human: 'CE' },
  D: { human: 'D' },
  D1: { human: 'D1' },
  D1E: { human: 'D1E' },
  DE: { human: 'DE' },
  L: { human: 'L' },
  T: { human: 'T' },
})
