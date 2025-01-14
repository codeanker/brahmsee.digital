import { Essgewohnheit } from '@prisma/client'

import { defineEnumMapping } from '../defineEnumMapping.js'

export const EssgewohnheitMapping = defineEnumMapping<Essgewohnheit>({
  OMNIVOR: { human: 'Omnivor' },
  VEGETARISCH: { human: 'Vegetarisch' },
  VEGAN: { human: 'Vegan' },
})
