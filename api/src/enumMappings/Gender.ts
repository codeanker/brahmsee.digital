import { Gender } from '@prisma/client'

import { defineEnumMapping } from "./defineEnumMapping.js"

export const GenderMapping = defineEnumMapping<Gender>({
  MALE: { human: 'Männlich' },
  FEMALE: { human: 'Weiblich' },
  UNSPECIFIED: { human: 'Divers' },
})

export { type Gender }
