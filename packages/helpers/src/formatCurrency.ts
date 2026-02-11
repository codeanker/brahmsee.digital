/* eslint-disable @typescript-eslint/no-unsafe-argument */
/**
 * Formats a numeric value as currency in German format (EUR).
 * @param value - The value to format (number or string that can be parsed to a number)
 * @param round - If true, rounds to whole numbers; if false, keeps 2 decimal places (default: false)
 * @param isCents - If true, treats the value as cents and divides by 100 (default: false)
 * @returns The formatted currency string in German locale (e.g., '1.234,56 €')
 * @example
 * formatCurrency(1234.56) // '1.234,56 €'
 * formatCurrency(12345, false, true) // '123,45 €' (value is in cents)
 * formatCurrency('99.99') // '99,99 €'
 */
export function formatCurrency(value, round = false, isCents = false) {
  if (typeof value !== 'number') {
    const parsedValue = Number.parseFloat(value)
    if (Number.isNaN(parsedValue)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value
    }
    value = parsedValue
  }
  if (!round) {
    value = toFixed(value, 2)
  }
  const formatter = new Intl.NumberFormat('de', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  })
  if (isCents) {
    return formatter.format(value / 100)
  } else {
    return formatter.format(value)
  }
}

/**
 * Internal helper to fix the number of decimal places without rounding.
 * @param num - The number to fix
 * @param fixed - The number of decimal places to keep
 * @returns The number with fixed decimal places
 * @internal
 */
function toFixed(num, fixed) {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const matches = num.toString().match(re)
  if (matches) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Number.parseFloat(matches[0])
  }
}
