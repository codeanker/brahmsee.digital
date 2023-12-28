import { Essgewohnheit } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping'

export const EssgewohnheitMapping = defineEnumMapping<Essgewohnheit>({
  OMNIVORE: { human: 'Omnivor' },
  VEGETARISCH: { human: 'Vegetarisch' },
  VEGAN: { human: 'Vegan' },
})
