export type StatusColors = 'muted' | 'primary' | 'secondary' | 'warning' | 'danger'

/**
 * Get Status Color for Tailwind CSS
 * @param status
 * @returns string
 */
export const getAnmeldungStatusColor = (status?: string) => {
  switch (status) {
    case 'OFFEN':
      return 'warning'
    case 'BESTAETIGT':
      return 'secondary'
    case 'ABGELEHNT':
      return 'danger'
    case 'STORNIERT':
      return 'muted'
    default:
      return 'muted'
  }
}
