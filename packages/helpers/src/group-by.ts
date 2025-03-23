export function groupBy<T, K extends string | number>(arr: T[], key: (item: T) => K): Record<K, T[]> {
  const result = {} as Record<K, T[]>

  for (const item of arr) {
    const keyValue = key(item)
    if (!result[keyValue]) {
      result[keyValue] = []
    }
    result[keyValue].push(item)
  }

  return result
}
