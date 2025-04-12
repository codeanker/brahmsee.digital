/**
 * Groups an array of objects by a key.
 *
 * @param arr The source array.
 * @param key The key extraction function.
 * @returns A record where the keys are the unique values returned by the key function
 *          and the values are arrays of objects that have that key value.
 * @template T The type of the objects in the array.
 */
export function groupBy<T, K extends string = string>(arr: T[], key: (item: T) => K): Record<K, T[]> {
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
