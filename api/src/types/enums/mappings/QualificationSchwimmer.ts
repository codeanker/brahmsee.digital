import { QualificationSchwimmer } from '@prisma/client'

import { defineEnumMapping } from '../defineEnumMapping'

export const QualificationSchwimmerMapping = defineEnumMapping<QualificationSchwimmer>({
  BRONZE: { human: 'Bronze' },
  SILBER: { human: 'Silber' },
  GOLD: { human: 'Gold' },
  JUNIORRETTER: { human: 'Juniorretter' },
  RETTUNGSSCHWIMMER_BRONZE: { human: 'Rettungsschwimmer Bronze' },
  RETTUNGSSCHWIMMER_SILBER: { human: 'Rettungsschwimmer Silber' },
  RETTUNGSSCHWIMMER_GOLD: { human: 'Rettungsschwimmer Gold' },
})
