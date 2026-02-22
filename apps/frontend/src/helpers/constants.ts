import type { Role } from '@codeanker/api'
import type { StatusColors } from './getAccountStatusColors'

export const roleColors: Record<Role, StatusColors> = {
  ADMIN: 'danger',
  GLIEDERUNG_ADMIN: 'warning',
  USER: 'muted',
}
