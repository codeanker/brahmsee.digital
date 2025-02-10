export type Prettify<T> = {
  [K in keyof T]: T[K]
} & {}

export type EnumMapping<T extends string | number = string> = { [K in T]: { human: string; description?: string } }

export function defineEnumMapping<T extends string | number>(mapping: Prettify<EnumMapping<T>>) {
  return mapping
}
