import { Prisma } from '@prisma/client'
import { defineEnumMapping } from './defineEnumMapping'

export const roleMapping = defineEnumMapping<Prisma.UserCreateInput['role']>({
  GLIEDERUNG_ADMIN: { human: 'Gliederung Admin' },
  ADMIN: { human: 'System Admin' },
})
