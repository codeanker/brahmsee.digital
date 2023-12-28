import { NahrungsmittelIntoleranz } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping'

export const NahrungsmittelIntoleranzMapping = defineEnumMapping<NahrungsmittelIntoleranz>({
  FRUCTOSE: { human: 'Fructose' },
  LAKTOSE: { human: 'Laktose' },
  GLUTEN: { human: 'Gluten' },
  SCHWEIN: { human: 'Schweinefleisch' },
})

export type NahrungsmittelIntoleranzEnum = NahrungsmittelIntoleranz
