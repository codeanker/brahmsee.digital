/**
 * Excludes fields from a prisma model.
 * @param entity The entity to exclude fields from.
 * @param keys The keys to exclude.
 * @returns The model without the given properties.
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
 */
export default function exclude<Entity, Key extends keyof Entity>(entity: Entity, ...keys: Key[]): Omit<Entity, Key> {
  const entries = Object.entries(entity).filter(([key]) => !keys.includes(key))
  const result = Object.fromEntries(entries)
  return result as Omit<Entity, Key>
}
