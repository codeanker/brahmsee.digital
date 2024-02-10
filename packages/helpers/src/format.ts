import { dayjs } from './dayjs'

function formatDateWith(date: Date, format: string): string {
  return dayjs(date).format(format)
}

export function formatDate(date: Date | null): string {
  if (!date) {
    return ''
  }

  return formatDateWith(date, 'DD.MM.YYYY')
}

export function formatTimestamp(date: Date | null): string {
  if (!date) {
    return ''
  }

  return formatDateWith(date, 'DD.MM.YYYY HH:mm:ss')
}
