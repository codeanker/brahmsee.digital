import { dayjs } from './dayjs.js'

/**
 * Formats a date using a custom format string.
 * @param date - The date to format (can be a Date object, string, or any dayjs-compatible type)
 * @param format - The format string (e.g., 'DD.MM.YYYY', 'YYYY-MM-DD HH:mm:ss')
 * @returns The formatted date string
 * @example
 * formatDateWith(new Date(), 'DD.MM.YYYY') // '10.02.2026'
 */
export function formatDateWith(date: dayjs.ConfigType, format: string): string {
  return dayjs(date).format(format)
}

/**
 * Formats a date in the German standard format (DD.MM.YYYY).
 * @param date - The date to format (can be a Date object, string, or any dayjs-compatible type)
 * @returns The formatted date string in DD.MM.YYYY format, or an empty string if date is falsy
 * @example
 * formatDate(new Date('2026-02-10')) // '10.02.2026'
 * formatDate(null) // ''
 */
export function formatDate(date: dayjs.ConfigType): string {
  if (!date) {
    return ''
  }

  return formatDateWith(date, 'DD.MM.YYYY')
}

/**
 * Formats a date with time in the German standard format (DD.MM.YYYY HH:mm:ss).
 * @param date - The date to format (can be a Date object, string, or any dayjs-compatible type)
 * @returns The formatted timestamp string in DD.MM.YYYY HH:mm:ss format, or an empty string if date is falsy
 * @example
 * formatTimestamp(new Date('2026-02-10T21:42:00')) // '10.02.2026 21:42:00'
 * formatTimestamp(null) // ''
 */
export function formatTimestamp(date: dayjs.ConfigType): string {
  if (!date) {
    return ''
  }

  return formatDateWith(date, 'DD.MM.YYYY HH:mm:ss')
}
