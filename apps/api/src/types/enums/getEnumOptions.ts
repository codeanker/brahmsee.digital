import { type EnumMapping } from './defineEnumMapping.js'

export function getEnumOptions<T extends EnumMapping>(enumMapping: T) {
  return Object.entries(enumMapping).map(([apiKey, mapping]) => {
    return {
      value: apiKey as keyof T,
      label: mapping.human,
      description: mapping.description,
    }
  })
}
