import { defineRule } from '../defineRule.js'

/**
 * Creates a validation rule that checks if a field's value matches a comparison value.
 * Typically used for password confirmation fields.
 * @param comparingValue - The value to compare against (e.g., the original password)
 * @returns A validation rule function
 * @example
 * // In a password confirmation field:
 * const passwordValue = 'myPassword123'
 * const confirmRule = confirm(passwordValue)
 * confirmRule('myPassword123', { name: 'Passwort bestätigen' }) // true
 * confirmRule('different', { name: 'Passwort bestätigen' }) // 'Das Feld Passwort bestätigen ist nicht gleich'
 */
export function confirm(comparingValue?: string) {
  return defineRule((value, context) => {
    const valid = value === comparingValue
    return valid || `Das Feld ${context.name} ist nicht gleich`
  })
}
