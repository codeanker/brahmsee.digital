/**
 * Excludes fields from a prisma model.
 * @param entity The entity to exclude fields from.
 * @param keys The keys to exclude.
 * @returns The model without the given properties.
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
 */
export default function exclude<T extends Record<string, unknown>, K extends keyof T>(
  entity: T,
  ...keys: K[]
): Omit<T, K> {
  const clone = { ...entity }
  for (const key of keys) {
    delete clone[key]
  }
  return clone
}
