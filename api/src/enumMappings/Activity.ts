import type { Activity, ActivityType } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping.js'

export const ActivityTypeMapping = defineEnumMapping<ActivityType>({
  CREATE: { human: 'Erstellt' },
  UPDATE: { human: 'Aktualisiert' },
  DELETE: { human: 'Gelöscht' },
  EMAIL: { human: 'E-Mail versandt' },
  OTHER: { human: 'Sonstiges' },
})

export type { Activity, ActivityType }
