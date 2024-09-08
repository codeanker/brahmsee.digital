import { UnterveranstaltungType } from '@prisma/client'

import { defineEnumMapping } from '../defineEnumMapping'

export const UnterveranstaltungTypeMapping = defineEnumMapping<UnterveranstaltungType>({
  CREW: { human: 'CREW' },
  GLIEDERUNG: { human: 'Gliederung' },
})

export { type UnterveranstaltungType }
