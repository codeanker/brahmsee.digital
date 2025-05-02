/* eslint-disable @typescript-eslint/no-unsafe-argument */
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

function toFixed(num, fixed) {
  const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const matches = num.toString().match(re)
  if (matches) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Number.parseFloat(matches[0])
  }
}
