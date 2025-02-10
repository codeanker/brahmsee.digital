import { Prisma, Role } from '@prisma/client'

import { defineEnumMapping } from '../defineEnumMapping.js'

export const roleMapping = defineEnumMapping<Prisma.AccountCreateInput['role']>({
  USER: { human: 'Benutzer' },
  GLIEDERUNG_ADMIN: { human: 'Gliederung Admin' },
  ADMIN: { human: 'System Admin' },
})

export { type Role }
