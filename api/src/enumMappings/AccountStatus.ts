import { AccountStatus } from '@prisma/client'

import { defineEnumMapping } from './defineEnumMapping'

export const AccountStatusMapping = defineEnumMapping<AccountStatus>({
  OPEN: { human: 'Offen' },
  ACTIVE: { human: 'Aktiv' },
  DISABLED: { human: 'Deaktiviert' },
})

export { AccountStatus }
