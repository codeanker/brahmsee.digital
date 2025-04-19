import { dayjs } from './dayjs.js'

export function formatDateWith(date: dayjs.ConfigType, format: string): string {
  return dayjs(date).format(format)
}

export function formatDate(date: dayjs.ConfigType): string {
  if (!date) {
    return ''
  }

  return formatDateWith(date, 'DD.MM.YYYY')
}

export function formatTimestamp(date: dayjs.ConfigType): string {
  if (!date) {
    return ''
  }

  return formatDateWith(date, 'DD.MM.YYYY HH:mm:ss')
}
