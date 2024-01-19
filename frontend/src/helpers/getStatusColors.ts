export type StatusColors = 'muted' | 'primary' | 'secondary' | 'warning' | 'danger'

/**
 * Get Status Color for Tailwind CSS
 * @param status
 * @returns string
 */
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'OPEN':
      return 'warning'
    case 'ACTIVE':
      return 'secondary'
    case 'DISABLED':
      return 'danger'
    default:
      return 'muted'
  }
}
