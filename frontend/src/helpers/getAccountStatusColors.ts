export type StatusColors = 'muted' | 'primary' | 'secondary' | 'warning' | 'danger'

/**
 * Get Status Color for Tailwind CSS
 * @param status
 * @returns string
 */
export const getAccountStatusColor = (status?: string) => {
  switch (status) {
    case 'OFFEN':
      return 'warning'
    case 'AKTIV':
      return 'secondary'
    case 'DEAKTIVIERT':
      return 'danger'
    default:
      return 'muted'
  }
}
