import { useRoute } from 'vue-router'

/**
 * Extracts and parses an integer parameter from the current route.
 * @param name - The name of the route parameter
 * @returns The parsed integer value, or NaN if the parameter is an array or cannot be parsed
 * @example
 * // For route /users/:id
 * const userId = paramInt('id') // Returns the parsed integer ID
 */
export function paramInt(name: string) {
  const route = useRoute()
  const id = route.params[name]
  if (Array.isArray(id)) {
    return NaN
  }

  return parseInt(id)
}
