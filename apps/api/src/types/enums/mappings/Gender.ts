import { Gender } from '@prisma/client'

import { defineEnumMapping } from '../defineEnumMapping.js'

export const GenderMapping = defineEnumMapping<Gender>({
  MALE: { human: 'Männlich' },
  FEMALE: { human: 'Weiblich' },
  DIVERS: { human: 'Divers' },
  UNSPECIFIED: { human: 'Keine Angabe' },
})

export { type Gender }
