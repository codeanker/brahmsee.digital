export type Prettify<T> = {
  [K in keyof T]: T[K]
  // eslint-disable-next-line @typescript-eslint/ban-types
} & {}

export type EnumMapping<T extends string | number = string> = { [K in T]: { human: string; description?: string } }

export function defineEnumMapping<T extends string | number>(mapping: Prettify<EnumMapping<T>>) {
  return mapping
}
