import { AccountStatus } from '@prisma/client'

import { defineEnumMapping } from "../defineEnumMapping.js"

export const AccountStatusMapping = defineEnumMapping<AccountStatus>({
  OFFEN: { human: 'Offen' },
  AKTIV: { human: 'Aktiv' },
  DEAKTIVIERT: { human: 'Deaktiviert' },
})

export { type AccountStatus }
