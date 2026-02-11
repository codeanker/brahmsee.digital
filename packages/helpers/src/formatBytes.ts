/**
 * Converts a byte value to a human-readable string with appropriate units.
 * @param bytes - The number of bytes to format
 * @param decimals - The number of decimal places to include (default: 2)
 * @returns A formatted string with the value and unit (e.g., '1.5 MB', '500 Bytes')
 * @example
 * formatBytes(1024) // '1 KB'
 * formatBytes(1536, 2) // '1.5 KB'
 * formatBytes(0) // '0 Bytes'
 */
export function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
