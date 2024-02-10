import type { Activity, ActivityType } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping'

export const ActivityTypeMapping = defineEnumMapping<ActivityType>({
  CREATE: { human: 'Erstellt' },
  UPDATE: { human: 'Aktualisiert' },
  DELETE: { human: 'Gelöscht' },
  EMAIL: { human: 'E-Mail versandt' },
  OTHER: { human: 'Anderes' },
})

export type { Activity, ActivityType }
